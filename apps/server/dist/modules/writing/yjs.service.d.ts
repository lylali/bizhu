import { OnModuleInit } from '@nestjs/common';
import * as Y from 'yjs';
import { PrismaService } from '../../prisma/prisma.service';
/**
 * YJS 文档管理服务
 * - 在内存中维护 Y.Doc 实例
 * - 处理文档持久化（带 debounce）
 * - 启动时从 DB 加载文档
 */
export declare class YjsService implements OnModuleInit {
    private prisma;
    private readonly logger;
    private documents;
    private readonly DEBOUNCE_DELAY;
    constructor(prisma: PrismaService);
    /**
     * 模块初始化时从数据库加载所有文档
     */
    onModuleInit(): Promise<void>;
    /**
     * 加载文档到内存
     */
    private loadDocumentInMemory;
    /**
     * 获取或创建文档
     */
    getOrCreateDocument(chapterId: string): Y.Doc;
    /**
     * 获取文档当前状态（Uint8Array）
     */
    getDocumentState(chapterId: string): Uint8Array;
    /**
     * 应用远程更新到文档
     */
    applyUpdate(chapterId: string, update: Uint8Array): void;
    /**
     * 从 Yjs 文档提取纯文本快照
     */
    private extractTextSnapshot;
    /**
     * 计算字数（中文字数 + 英文单词）
     */
    private calculateWordCount;
    /**
     * 计划持久化（带 debounce）
     */
    private schedulePersist;
    /**
     * 持久化文档到数据库
     */
    private persistDocument;
    /**
     * 立即保存文档（手动触发）
     */
    saveDocumentNow(chapterId: string): Promise<void>;
    /**
     * 清理文档（断开连接或删除时）
     */
    cleanupDocument(chapterId: string): Promise<void>;
    /**
     * 获取当前内存中的文档数量（用于监控）
     */
    getDocumentCount(): number;
    /**
     * 获取所有文档的 ID（用于监控）
     */
    getDocumentIds(): string[];
}
//# sourceMappingURL=yjs.service.d.ts.map