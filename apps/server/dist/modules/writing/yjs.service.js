"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var YjsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.YjsService = void 0;
const common_1 = require("@nestjs/common");
const Y = __importStar(require("yjs"));
const prisma_service_1 = require("../../prisma/prisma.service");
/**
 * YJS 文档管理服务
 * - 在内存中维护 Y.Doc 实例
 * - 处理文档持久化（带 debounce）
 * - 启动时从 DB 加载文档
 */
let YjsService = YjsService_1 = class YjsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(YjsService_1.name);
        this.documents = new Map();
        this.DEBOUNCE_DELAY = 10000; // 10 秒
    }
    /**
     * 模块初始化时从数据库加载所有文档
     */
    async onModuleInit() {
        try {
            this.logger.log('Loading Yjs documents from database...');
            const chapters = await this.prisma.chapter.findMany({
                select: {
                    id: true,
                    yjsDoc: true,
                },
                where: {
                    yjsDoc: {
                        not: null,
                    },
                },
            });
            for (const chapter of chapters) {
                if (chapter.yjsDoc) {
                    this.loadDocumentInMemory(chapter.id, chapter.yjsDoc);
                }
            }
            this.logger.log(`Loaded ${chapters.length} Yjs documents into memory`);
        }
        catch (error) {
            this.logger.error('Failed to load Yjs documents on startup', error);
        }
    }
    /**
     * 加载文档到内存
     */
    loadDocumentInMemory(chapterId, yjsDocBuffer) {
        const doc = new Y.Doc();
        try {
            Y.applyUpdate(doc, new Uint8Array(yjsDocBuffer));
            this.documents.set(chapterId, { doc });
            this.logger.debug(`Loaded document for chapter ${chapterId}`);
        }
        catch (error) {
            this.logger.error(`Failed to load document for chapter ${chapterId}`, error);
        }
    }
    /**
     * 获取或创建文档
     */
    getOrCreateDocument(chapterId) {
        if (this.documents.has(chapterId)) {
            return this.documents.get(chapterId).doc;
        }
        const doc = new Y.Doc();
        this.documents.set(chapterId, { doc });
        this.logger.debug(`Created new document for chapter ${chapterId}`);
        return doc;
    }
    /**
     * 获取文档当前状态（Uint8Array）
     */
    getDocumentState(chapterId) {
        const doc = this.getOrCreateDocument(chapterId);
        return Y.encodeStateAsUpdate(doc);
    }
    /**
     * 应用远程更新到文档
     */
    applyUpdate(chapterId, update) {
        const doc = this.getOrCreateDocument(chapterId);
        try {
            Y.applyUpdate(doc, update);
            this.schedulePersist(chapterId);
        }
        catch (error) {
            this.logger.error(`Failed to apply update for chapter ${chapterId}`, error);
        }
    }
    /**
     * 从 Yjs 文档提取纯文本快照
     */
    extractTextSnapshot(doc) {
        try {
            const ytext = doc.getText('content');
            return ytext.toString();
        }
        catch (error) {
            this.logger.warn('Failed to extract text snapshot', error);
            return '';
        }
    }
    /**
     * 计算字数（中文字数 + 英文单词）
     */
    calculateWordCount(text) {
        if (!text)
            return 0;
        const chineseChars = text.match(/[\u4e00-\u9fa5]/g)?.length || 0;
        const englishWords = text.replace(/[\u4e00-\u9fa5]/g, '').match(/\b\w+\b/g)?.length || 0;
        return chineseChars + englishWords;
    }
    /**
     * 计划持久化（带 debounce）
     */
    schedulePersist(chapterId) {
        const state = this.documents.get(chapterId);
        if (!state)
            return;
        // 清除已有的 timeout
        if (state.debounceTimeout) {
            clearTimeout(state.debounceTimeout);
        }
        // 设置新的延迟保存
        state.debounceTimeout = setTimeout(() => {
            this.persistDocument(chapterId).catch((error) => {
                this.logger.error(`Failed to persist chapter ${chapterId}`, error);
            });
        }, this.DEBOUNCE_DELAY);
    }
    /**
     * 持久化文档到数据库
     */
    async persistDocument(chapterId) {
        const state = this.documents.get(chapterId);
        if (!state)
            return;
        try {
            const yjsDocBuffer = Buffer.from(Y.encodeStateAsUpdate(state.doc));
            const textSnapshot = this.extractTextSnapshot(state.doc);
            const wordCount = this.calculateWordCount(textSnapshot);
            await this.prisma.chapter.update({
                where: { id: chapterId },
                data: {
                    yjsDoc: yjsDocBuffer,
                    textSnapshot,
                    wordCount,
                },
            });
            this.logger.debug(`Persisted chapter ${chapterId}: ${wordCount} words, ${yjsDocBuffer.length} bytes`);
        }
        catch (error) {
            this.logger.error(`Failed to persist chapter ${chapterId}`, error);
            throw error;
        }
    }
    /**
     * 立即保存文档（手动触发）
     */
    async saveDocumentNow(chapterId) {
        const state = this.documents.get(chapterId);
        if (state && state.debounceTimeout) {
            clearTimeout(state.debounceTimeout);
            state.debounceTimeout = undefined;
        }
        await this.persistDocument(chapterId);
    }
    /**
     * 清理文档（断开连接或删除时）
     */
    async cleanupDocument(chapterId) {
        const state = this.documents.get(chapterId);
        if (state) {
            if (state.debounceTimeout) {
                clearTimeout(state.debounceTimeout);
            }
            // 先保存后删除
            await this.persistDocument(chapterId);
            this.documents.delete(chapterId);
            this.logger.debug(`Cleaned up document for chapter ${chapterId}`);
        }
    }
    /**
     * 获取当前内存中的文档数量（用于监控）
     */
    getDocumentCount() {
        return this.documents.size;
    }
    /**
     * 获取所有文档的 ID（用于监控）
     */
    getDocumentIds() {
        return Array.from(this.documents.keys());
    }
};
exports.YjsService = YjsService;
exports.YjsService = YjsService = YjsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], YjsService);
//# sourceMappingURL=yjs.service.js.map