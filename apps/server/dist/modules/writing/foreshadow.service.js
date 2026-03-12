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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForeshadowService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ForeshadowService = class ForeshadowService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // 获取当前用户ID（暂时mock）
    getCurrentUserId() {
        return 'user-123';
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
            throw new common_1.ForbiddenException('无权访问此作品');
        }
    }
    // 获取所有伏笔
    async getAll(workId) {
        try {
            await this.validateWorkOwnership(workId);
            const foreshadows = await this.prisma.foreshadow.findMany({
                where: { workId },
                include: {
                    plantedChapter: {
                        select: { id: true, title: true, order: true },
                    },
                    expectedResolveChapter: {
                        select: { id: true, title: true, order: true },
                    },
                },
                orderBy: [
                    { isResolved: 'asc' },
                    { priority: 'asc' },
                    { createdAt: 'desc' },
                ],
            });
            return { data: foreshadows };
        }
        catch (error) {
            console.error('Failed to get foreshadows:', error);
            throw error;
        }
    }
    // 创建伏笔
    async create(workId, request) {
        try {
            await this.validateWorkOwnership(workId);
            // 验证章节存在且属于该作品
            if (request.plantedChapterId) {
                await this.validateChapterOwnership(workId, request.plantedChapterId);
            }
            if (request.expectedResolveChapterId) {
                await this.validateChapterOwnership(workId, request.expectedResolveChapterId);
            }
            const foreshadow = await this.prisma.foreshadow.create({
                data: {
                    workId,
                    description: request.description,
                    plantedChapterId: request.plantedChapterId,
                    expectedResolveChapterId: request.expectedResolveChapterId,
                    priority: request.priority || 'medium',
                    notes: request.notes,
                },
                include: {
                    plantedChapter: {
                        select: { id: true, title: true, order: true },
                    },
                    expectedResolveChapter: {
                        select: { id: true, title: true, order: true },
                    },
                },
            });
            return { data: foreshadow };
        }
        catch (error) {
            console.error('Failed to create foreshadow:', error);
            throw error;
        }
    }
    // 更新伏笔
    async update(workId, foreshadowId, request) {
        try {
            await this.validateWorkOwnership(workId);
            // 验证伏笔存在且属于该作品
            const existingForeshadow = await this.prisma.foreshadow.findFirst({
                where: { id: foreshadowId, workId },
            });
            if (!existingForeshadow) {
                throw new common_1.NotFoundException('伏笔不存在');
            }
            // 验证章节存在且属于该作品
            if (request.plantedChapterId) {
                await this.validateChapterOwnership(workId, request.plantedChapterId);
            }
            if (request.expectedResolveChapterId) {
                await this.validateChapterOwnership(workId, request.expectedResolveChapterId);
            }
            const foreshadow = await this.prisma.foreshadow.update({
                where: { id: foreshadowId },
                data: {
                    description: request.description,
                    plantedChapterId: request.plantedChapterId,
                    expectedResolveChapterId: request.expectedResolveChapterId,
                    isResolved: request.isResolved,
                    priority: request.priority,
                    notes: request.notes,
                },
                include: {
                    plantedChapter: {
                        select: { id: true, title: true, order: true },
                    },
                    expectedResolveChapter: {
                        select: { id: true, title: true, order: true },
                    },
                },
            });
            return { data: foreshadow };
        }
        catch (error) {
            console.error('Failed to update foreshadow:', error);
            throw error;
        }
    }
    // 删除伏笔
    async delete(workId, foreshadowId) {
        try {
            await this.validateWorkOwnership(workId);
            // 验证伏笔存在且属于该作品
            const existingForeshadow = await this.prisma.foreshadow.findFirst({
                where: { id: foreshadowId, workId },
            });
            if (!existingForeshadow) {
                throw new common_1.NotFoundException('伏笔不存在');
            }
            await this.prisma.foreshadow.delete({
                where: { id: foreshadowId },
            });
        }
        catch (error) {
            console.error('Failed to delete foreshadow:', error);
            throw error;
        }
    }
    // 验证章节所有权
    async validateChapterOwnership(workId, chapterId) {
        const chapter = await this.prisma.chapter.findFirst({
            where: { id: chapterId, workId },
        });
        if (!chapter) {
            throw new common_1.NotFoundException('章节不存在或不属于该作品');
        }
    }
};
exports.ForeshadowService = ForeshadowService;
exports.ForeshadowService = ForeshadowService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ForeshadowService);
//# sourceMappingURL=foreshadow.service.js.map