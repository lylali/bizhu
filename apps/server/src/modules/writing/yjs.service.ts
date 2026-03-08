import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Y from 'yjs';
import { PrismaService } from '../../prisma/prisma.service';

interface DocumentState {
  doc: Y.Doc;
  debounceTimeout?: NodeJS.Timeout;
}

/**
 * YJS 文档管理服务
 * - 在内存中维护 Y.Doc 实例
 * - 处理文档持久化（带 debounce）
 * - 启动时从 DB 加载文档
 */
@Injectable()
export class YjsService implements OnModuleInit {
  private readonly logger = new Logger(YjsService.name);
  private documents = new Map<string, DocumentState>();
  private readonly DEBOUNCE_DELAY = 10000; // 10 秒

  constructor(private prisma: PrismaService) {}

  /**
   * 模块初始化时从数据库加载所有文档
   */
  async onModuleInit(): Promise<void> {
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
    } catch (error) {
      this.logger.error('Failed to load Yjs documents on startup', error);
    }
  }

  /**
   * 加载文档到内存
   */
  private loadDocumentInMemory(chapterId: string, yjsDocBuffer: Buffer): void {
    const doc = new Y.Doc();
    try {
      Y.applyUpdate(doc, new Uint8Array(yjsDocBuffer));
      this.documents.set(chapterId, { doc });
      this.logger.debug(`Loaded document for chapter ${chapterId}`);
    } catch (error) {
      this.logger.error(`Failed to load document for chapter ${chapterId}`, error);
    }
  }

  /**
   * 获取或创建文档
   */
  getOrCreateDocument(chapterId: string): Y.Doc {
    if (this.documents.has(chapterId)) {
      return this.documents.get(chapterId)!.doc;
    }

    const doc = new Y.Doc();
    this.documents.set(chapterId, { doc });
    this.logger.debug(`Created new document for chapter ${chapterId}`);
    return doc;
  }

  /**
   * 获取文档当前状态（Uint8Array）
   */
  getDocumentState(chapterId: string): Uint8Array {
    const doc = this.getOrCreateDocument(chapterId);
    return Y.encodeStateAsUpdate(doc);
  }

  /**
   * 应用远程更新到文档
   */
  applyUpdate(chapterId: string, update: Uint8Array): void {
    const doc = this.getOrCreateDocument(chapterId);
    try {
      Y.applyUpdate(doc, update);
      this.schedulePersist(chapterId);
    } catch (error) {
      this.logger.error(`Failed to apply update for chapter ${chapterId}`, error);
    }
  }

  /**
   * 从 Yjs 文档提取纯文本快照
   */
  private extractTextSnapshot(doc: Y.Doc): string {
    try {
      const ytext = doc.getText('content');
      return ytext.toString();
    } catch (error) {
      this.logger.warn('Failed to extract text snapshot', error);
      return '';
    }
  }

  /**
   * 计算字数（中文字数 + 英文单词）
   */
  private calculateWordCount(text: string): number {
    if (!text) return 0;
    const chineseChars = text.match(/[\u4e00-\u9fa5]/g)?.length || 0;
    const englishWords = text.replace(/[\u4e00-\u9fa5]/g, '').match(/\b\w+\b/g)?.length || 0;
    return chineseChars + englishWords;
  }

  /**
   * 计划持久化（带 debounce）
   */
  private schedulePersist(chapterId: string): void {
    const state = this.documents.get(chapterId);
    if (!state) return;

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
  private async persistDocument(chapterId: string): Promise<void> {
    const state = this.documents.get(chapterId);
    if (!state) return;

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

      this.logger.debug(
        `Persisted chapter ${chapterId}: ${wordCount} words, ${yjsDocBuffer.length} bytes`
      );
    } catch (error) {
      this.logger.error(`Failed to persist chapter ${chapterId}`, error);
      throw error;
    }
  }

  /**
   * 立即保存文档（手动触发）
   */
  async saveDocumentNow(chapterId: string): Promise<void> {
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
  async cleanupDocument(chapterId: string): Promise<void> {
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
  getDocumentCount(): number {
    return this.documents.size;
  }

  /**
   * 获取所有文档的 ID（用于监控）
   */
  getDocumentIds(): string[] {
    return Array.from(this.documents.keys());
  }
}
