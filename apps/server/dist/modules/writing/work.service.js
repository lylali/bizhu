"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const prisma_service_1 = require("../../prisma/prisma.service");
let WorkService = class WorkService {
    constructor(prisma, cacheManager) {
        this.prisma = prisma;
        this.cacheManager = cacheManager;
    }
    // 获取用户的所有作品（暂时用 mock userId）
    getCurrentUserId() {
        // TODO: 从 JWT token 获取真实 userId
        return 'user-123';
    }
    async createWork(request) {
        const userId = this.getCurrentUserId();
        try {
            const work = await this.prisma.work.create({
                data: {
                    authorId: userId,
                    title: request.title,
                    description: request.description,
                    type: request.type,
                    status: 'draft',
                },
            });
            // 创建一个默认章节
            const chapter = await this.prisma.chapter.create({
                data: {
                    workId: work.id,
                    title: '第一章',
                    order: 1,
                    wordCount: 0,
                    publishStatus: 'draft',
                },
            });
            return {
                data: {
                    id: work.id,
                    title: work.title,
                    description: work.description || undefined,
                    type: work.type,
                    status: work.status,
                    coverId: work.coverId || undefined,
                    totalWordCount: 0,
                    todayWordCount: 0,
                    streak: 0,
                    chapterCount: 1,
                    createdAt: work.createdAt,
                    updatedAt: work.updatedAt,
                },
            };
        }
        catch (error) {
            throw new Error('创建作品失败');
        }
    }
    async getWorks() {
        try {
            const userId = this.getCurrentUserId();
            const works = await this.prisma.work.findMany({
                where: { authorId: userId },
                include: {
                    chapters: {
                        select: {
                            wordCount: true,
                            updatedAt: true,
                        },
                    },
                    _count: {
                        select: {
                            chapters: true,
                        },
                    },
                },
                orderBy: { updatedAt: 'desc' },
            });
            // 计算每个作品的统计数据
            const worksWithStats = await Promise.all(works.map(async (work) => {
                const stats = await this.getCachedWorkStats(work.id, work.chapters);
                return {
                    id: work.id,
                    title: work.title,
                    description: work.description || undefined,
                    type: work.type,
                    status: work.status,
                    coverId: work.coverId || undefined,
                    totalWordCount: stats.totalWordCount,
                    todayWordCount: stats.todayWordCount,
                    streak: stats.streak,
                    chapterCount: work._count.chapters,
                    createdAt: work.createdAt,
                    updatedAt: work.updatedAt,
                };
            }));
            return {
                data: worksWithStats,
                meta: {
                    total: worksWithStats.length,
                },
            };
        }
        catch (error) {
            throw new Error('获取作品列表失败');
        }
    }
    async getWorkStats(workId) {
        try {
            // 验证作品所有权
            await this.validateWorkOwnership(workId);
            const chapters = await this.prisma.chapter.findMany({
                where: { workId },
                select: {
                    wordCount: true,
                    updatedAt: true,
                },
            });
            const stats = await this.getCachedWorkStats(workId, chapters);
            return {
                data: stats,
            };
        }
        catch (error) {
            throw new Error('获取作品统计失败');
        }
    }
    // 获取缓存的统计数据
    async getCachedWorkStats(workId, chapters) {
        const cacheKey = `work:stats:${workId}`;
        // 尝试从缓存获取
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        // 计算统计数据
        const stats = await this.calculateWorkStats(workId, chapters);
        // 缓存1小时
        await this.cacheManager.set(cacheKey, stats, 3600000);
        return stats;
    }
    // 计算作品统计数据
    async calculateWorkStats(workId, chapters) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        // 总字数
        const totalWordCount = chapters.reduce((sum, chapter) => sum + chapter.wordCount, 0);
        // 今日字数：今天更新的章节字数之和
        const todayWordCount = chapters
            .filter(chapter => chapter.updatedAt >= today)
            .reduce((sum, chapter) => sum + chapter.wordCount, 0);
        // 连续更新天数（streak）
        const streak = await this.calculateStreak(workId);
        return {
            totalWordCount,
            todayWordCount,
            streak,
            chapterCount: chapters.length,
        };
    }
    // 计算连续更新天数
    async calculateStreak(workId) {
        const now = new Date();
        let streak = 0;
        let currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        // 从今天开始往前检查每一天是否有更新
        while (true) {
            const nextDay = new Date(currentDate);
            nextDay.setDate(currentDate.getDate() + 1);
            const hasUpdate = await this.prisma.chapter.findFirst({
                where: {
                    workId,
                    updatedAt: {
                        gte: currentDate,
                        lt: nextDay,
                    },
                },
            });
            if (hasUpdate) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            }
            else {
                break;
            }
        }
        return streak;
    }
    // 验证作品所有权
    async validateWorkOwnership(workId) {
        const userId = this.getCurrentUserId();
        const work = await this.prisma.work.findUnique({
            where: { id: workId },
            select: { authorId: true },
        });
        if (!work) {
            throw new common_1.NotFoundException('作品不存在');
        }
        if (work.authorId !== userId) {
            throw new common_1.NotFoundException('无权访问此作品');
        }
    }
};
exports.WorkService = WorkService;
exports.WorkService = WorkService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], WorkService);
//# sourceMappingURL=work.service.js.map