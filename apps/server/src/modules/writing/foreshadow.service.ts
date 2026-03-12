import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Foreshadow,
  ForeshadowListResponse,
  ForeshadowResponse,
} from '@shared';
import {
  CreateForeshadowDto,
  UpdateForeshadowDto,
} from './foreshadow.dto';

@Injectable()
export class ForeshadowService {
  constructor(private prisma: PrismaService) {}

  // 获取当前用户ID（暂时mock）
  private getCurrentUserId(): string {
    return 'user-123';
  }

  // 验证作品所有权
  private async validateWorkOwnership(workId: string): Promise<void> {
    const userId = this.getCurrentUserId();

    const work = await this.prisma.work.findUnique({
      where: { id: workId },
      select: { authorId: true },
    });

    if (!work) {
      throw new NotFoundException('作品不存在');
    }

    if (work.authorId !== userId) {
      throw new ForbiddenException('无权访问此作品');
    }
  }

  // 获取所有伏笔
  async getAll(workId: string): Promise<ForeshadowListResponse> {
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
    } catch (error) {
      console.error('Failed to get foreshadows:', error);
      throw error;
    }
  }

  // 创建伏笔
  async create(workId: string, request: CreateForeshadowDto): Promise<ForeshadowResponse> {
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
    } catch (error) {
      console.error('Failed to create foreshadow:', error);
      throw error;
    }
  }

  // 更新伏笔
  async update(workId: string, foreshadowId: string, request: UpdateForeshadowDto): Promise<ForeshadowResponse> {
    try {
      await this.validateWorkOwnership(workId);

      // 验证伏笔存在且属于该作品
      const existingForeshadow = await this.prisma.foreshadow.findFirst({
        where: { id: foreshadowId, workId },
      });
      if (!existingForeshadow) {
        throw new NotFoundException('伏笔不存在');
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
    } catch (error) {
      console.error('Failed to update foreshadow:', error);
      throw error;
    }
  }

  // 删除伏笔
  async delete(workId: string, foreshadowId: string): Promise<void> {
    try {
      await this.validateWorkOwnership(workId);

      // 验证伏笔存在且属于该作品
      const existingForeshadow = await this.prisma.foreshadow.findFirst({
        where: { id: foreshadowId, workId },
      });
      if (!existingForeshadow) {
        throw new NotFoundException('伏笔不存在');
      }

      await this.prisma.foreshadow.delete({
        where: { id: foreshadowId },
      });
    } catch (error) {
      console.error('Failed to delete foreshadow:', error);
      throw error;
    }
  }

  // 验证章节所有权
  private async validateChapterOwnership(workId: string, chapterId: string): Promise<void> {
    const chapter = await this.prisma.chapter.findFirst({
      where: { id: chapterId, workId },
    });
    if (!chapter) {
      throw new NotFoundException('章节不存在或不属于该作品');
    }
  }
}