import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateChapterRequest,
  UpdateChapterRequest,
  SaveChapterContentRequest,
  ChapterListResponse,
  ChapterResponse,
  ChapterWithContentResponse,
} from '@shared';

@Injectable()
export class ChapterService {
  constructor(private prisma: PrismaService) {}

  // 验证作品所有权
  private async validateWorkOwnership(workId: string, userId?: string): Promise<void> {
    // TODO: 从 JWT token 获取 userId
    // 暂时用假数据测试
    const mockUserId = 'user-123';

    const work = await this.prisma.work.findUnique({
      where: { id: workId },
      select: { authorId: true },
    });

    if (!work) {
      throw new NotFoundException('作品不存在');
    }

    if (work.authorId !== mockUserId) {
      throw new ForbiddenException('无权访问此作品');
    }
  }

  // 计算字数：中文按字符算，英文按单词算
  private calculateWordCount(textSnapshot: string): number {
    if (!textSnapshot) return 0;

    // 中文字符（包括标点）
    const chineseChars = textSnapshot.match(/[\u4e00-\u9fa5]/g)?.length || 0;
    // 英文单词
    const englishWords = textSnapshot.replace(/[\u4e00-\u9fa5]/g, '').match(/\b\w+\b/g)?.length || 0;

    return chineseChars + englishWords;
  }

  async createChapter(workId: string, request: CreateChapterRequest): Promise<ChapterResponse> {
    await this.validateWorkOwnership(workId);

    // 获取当前作品的章节数量来设置 order
    const chapterCount = await this.prisma.chapter.count({
      where: { workId },
    });

    const chapter = await this.prisma.chapter.create({
      data: {
        workId,
        title: request.title,
        order: request.order ?? chapterCount + 1,
        wordCount: 0,
        publishStatus: 'draft',
      },
    });

    return {
      data: {
        id: chapter.id,
        workId: chapter.workId,
        title: chapter.title,
        order: chapter.order,
        wordCount: chapter.wordCount,
        publishStatus: chapter.publishStatus as 'draft' | 'published' | 'archived',
        createdAt: chapter.createdAt.toISOString(),
        updatedAt: chapter.updatedAt.toISOString(),
      },
      meta: {},
    };
  }

  async getChapters(workId: string): Promise<ChapterListResponse> {
    await this.validateWorkOwnership(workId);

    const chapters = await this.prisma.chapter.findMany({
      where: { workId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        workId: true,
        title: true,
        order: true,
        wordCount: true,
        publishStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      data: chapters.map(chapter => ({
        id: chapter.id,
        workId: chapter.workId,
        title: chapter.title,
        order: chapter.order,
        wordCount: chapter.wordCount,
        publishStatus: chapter.publishStatus as 'draft' | 'published' | 'archived',
        createdAt: chapter.createdAt.toISOString(),
        updatedAt: chapter.updatedAt.toISOString(),
      })),
      meta: {
        total: chapters.length,
        workId,
      },
    };
  }

  async getChapter(workId: string, chapterId: string): Promise<ChapterWithContentResponse> {
    await this.validateWorkOwnership(workId);

    const chapter = await this.prisma.chapter.findFirst({
      where: {
        id: chapterId,
        workId,
      },
    });

    if (!chapter) {
      throw new NotFoundException('章节不存在');
    }

    return {
      data: {
        id: chapter.id,
        workId: chapter.workId,
        title: chapter.title,
        order: chapter.order,
        wordCount: chapter.wordCount,
        publishStatus: chapter.publishStatus as 'draft' | 'published' | 'archived',
        yjsDoc: chapter.yjsDoc ?? undefined,
        textSnapshot: chapter.textSnapshot ?? undefined,
        createdAt: chapter.createdAt.toISOString(),
        updatedAt: chapter.updatedAt.toISOString(),
      },
      meta: {},
    };
  }

  async updateChapter(
    workId: string,
    chapterId: string,
    request: UpdateChapterRequest,
  ): Promise<ChapterResponse> {
    await this.validateWorkOwnership(workId);

    const chapter = await this.prisma.chapter.update({
      where: {
        id: chapterId,
        workId,
      },
      data: {
        ...(request.title && { title: request.title }),
        ...(request.order !== undefined && { order: request.order }),
        ...(request.publishStatus && { publishStatus: request.publishStatus }),
      },
    });

    return {
      data: {
        id: chapter.id,
        workId: chapter.workId,
        title: chapter.title,
        order: chapter.order,
        wordCount: chapter.wordCount,
        publishStatus: chapter.publishStatus as 'draft' | 'published' | 'archived',
        createdAt: chapter.createdAt.toISOString(),
        updatedAt: chapter.updatedAt.toISOString(),
      },
      meta: {},
    };
  }

  async deleteChapter(workId: string, chapterId: string): Promise<void> {
    await this.validateWorkOwnership(workId);

    // 删除章节时同步删除关联的伏笔记录
    await this.prisma.$transaction(async (tx) => {
      // 删除 plantedChapterId 或 expectedResolveChapterId 指向此章节的伏笔
      await tx.foreshadow.deleteMany({
        where: {
          OR: [
            { plantedChapterId: chapterId },
            { expectedResolveChapterId: chapterId },
          ],
        },
      });

      // 删除章节
      await tx.chapter.delete({
        where: {
          id: chapterId,
          workId,
        },
      });
    });
  }

  async saveChapterContent(
    workId: string,
    chapterId: string,
    request: SaveChapterContentRequest,
  ): Promise<ChapterResponse> {
    await this.validateWorkOwnership(workId);

    const wordCount = this.calculateWordCount(request.textSnapshot);

    const chapter = await this.prisma.chapter.update({
      where: {
        id: chapterId,
        workId,
      },
      data: {
        yjsDoc: request.yjsDoc,
        textSnapshot: request.textSnapshot,
        wordCount,
      },
    });

    return {
      data: {
        id: chapter.id,
        workId: chapter.workId,
        title: chapter.title,
        order: chapter.order,
        wordCount: chapter.wordCount,
        publishStatus: chapter.publishStatus as 'draft' | 'published' | 'archived',
        createdAt: chapter.createdAt.toISOString(),
        updatedAt: chapter.updatedAt.toISOString(),
      },
      meta: {},
    };
  }
}