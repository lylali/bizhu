import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOutlineNodeDto, UpdateOutlineNodeDto, ReorderOutlineNodeDto } from './dto/outline.dto';
import type { OutlineNode } from '@prisma/client';

@Injectable()
export class OutlineService {
  constructor(private prisma: PrismaService) {}

  /**
   * 递归构建树形结构
   */
  private buildTree(nodes: OutlineNode[], parentId: string | null = null): OutlineNode[] {
    return nodes
      .filter((node) => node.parentId === parentId)
      .sort((a, b) => a.order - b.order)
      .map((node) => ({
        ...node,
        children: this.buildTree(nodes, node.id),
      })) as any;
  }

  /**
   * 获取完整大纲树
   */
  async getTree(workId: string, userId: string) {
    // 验证用户有权限访问该作品
    const work = await this.prisma.work.findUnique({
      where: { id: workId },
      select: { authorId: true },
    });

    if (!work) {
      throw new NotFoundException(`Work ${workId} not found`);
    }

    if (work.authorId !== userId) {
      throw new ForbiddenException('You do not have permission to access this work');
    }

    // 一次查询获取所有大纲节点
    const allNodes = await this.prisma.outlineNode.findMany({
      where: { workId },
      orderBy: [{ parentId: 'asc' }, { order: 'asc' }],
    });

    // 构建树形结构（只返回顶级节点，递归包含 children）
    const roots = this.buildTree(allNodes);

    return {
      workId,
      roots,
    };
  }

  /**
   * 创建大纲节点
   */
  async createNode(
    workId: string,
    userId: string,
    createDto: CreateOutlineNodeDto,
  ): Promise<OutlineNode> {
    // 验证权限
    const work = await this.prisma.work.findUnique({
      where: { id: workId },
      select: { authorId: true },
    });

    if (!work || work.authorId !== userId) {
      throw new ForbiddenException('You do not have permission to create nodes in this work');
    }

    // 如果指定了 parentId，验证父节点存在且属于同一作品
    if (createDto.parentId) {
      const parent = await this.prisma.outlineNode.findUnique({
        where: { id: createDto.parentId },
      });

      if (!parent || parent.workId !== workId) {
        throw new BadRequestException('Parent node does not exist in this work');
      }
    }

    // 如果指定了 chapterId，验证章节存在且属于同一作品
    if (createDto.chapterId) {
      const chapter = await this.prisma.chapter.findUnique({
        where: { id: createDto.chapterId },
      });

      if (!chapter || chapter.workId !== workId) {
        throw new BadRequestException('Chapter does not exist in this work');
      }
    }

    // 获取同级最大 order
    const maxOrder = await this.prisma.outlineNode.findFirst({
      where: {
        workId,
        parentId: createDto.parentId || null,
      },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const order = (maxOrder?.order ?? -1) + 1;

    return this.prisma.outlineNode.create({
      data: {
        workId,
        title: createDto.title,
        content: createDto.content,
        parentId: createDto.parentId,
        chapterId: createDto.chapterId,
        order,
      },
    });
  }

  /**
   * 更新大纲节点
   */
  async updateNode(
    workId: string,
    nodeId: string,
    userId: string,
    updateDto: UpdateOutlineNodeDto,
  ): Promise<OutlineNode> {
    // 验证节点存在且属于该作品
    const node = await this.prisma.outlineNode.findUnique({
      where: { id: nodeId },
    });

    if (!node || node.workId !== workId) {
      throw new NotFoundException(`Outline node ${nodeId} not found in work ${workId}`);
    }

    // 验证权限
    const work = await this.prisma.work.findUnique({
      where: { id: workId },
      select: { authorId: true },
    });

    if (work?.authorId !== userId) {
      throw new ForbiddenException('You do not have permission to update nodes in this work');
    }

    // 如果更新了 chapterId，验证新章节存在
    if (updateDto.chapterId !== undefined && updateDto.chapterId) {
      const chapter = await this.prisma.chapter.findUnique({
        where: { id: updateDto.chapterId },
      });

      if (!chapter || chapter.workId !== workId) {
        throw new BadRequestException('Chapter does not exist in this work');
      }
    }

    return this.prisma.outlineNode.update({
      where: { id: nodeId },
      data: {
        ...(updateDto.title && { title: updateDto.title }),
        ...(updateDto.content !== undefined && { content: updateDto.content }),
        ...(updateDto.order !== undefined && { order: updateDto.order }),
        ...(updateDto.chapterId !== undefined && { chapterId: updateDto.chapterId || null }),
      },
    });
  }

  /**
   * 删除大纲节点（自动级联删除子节点）
   */
  async deleteNode(workId: string, nodeId: string, userId: string): Promise<OutlineNode> {
    // 验证节点存在
    const node = await this.prisma.outlineNode.findUnique({
      where: { id: nodeId },
    });

    if (!node || node.workId !== workId) {
      throw new NotFoundException(`Outline node ${nodeId} not found`);
    }

    // 验证权限
    const work = await this.prisma.work.findUnique({
      where: { id: workId },
      select: { authorId: true },
    });

    if (work?.authorId !== userId) {
      throw new ForbiddenException('You do not have permission to delete nodes in this work');
    }

    // 删除节点（Prisma 设置了 onDelete: Cascade，会自动删除子节点）
    return this.prisma.outlineNode.delete({
      where: { id: nodeId },
    });
  }

  /**
   * 批量更新节点顺序（用事务保证原子性）
   */
  async reorderNodes(
    workId: string,
    userId: string,
    nodesToReorder: ReorderOutlineNodeDto[],
  ): Promise<OutlineNode[]> {
    // 验证权限
    const work = await this.prisma.work.findUnique({
      where: { id: workId },
      select: { authorId: true },
    });

    if (work?.authorId !== userId) {
      throw new ForbiddenException('You do not have permission to reorder nodes in this work');
    }

    // 验证所有节点属于该作品
    const nodeIds = nodesToReorder.map((n) => n.id);
    const nodes = await this.prisma.outlineNode.findMany({
      where: {
        id: { in: nodeIds },
        workId,
      },
    });

    if (nodes.length !== nodeIds.length) {
      throw new BadRequestException('Some nodes do not exist in this work');
    }

    // 验证 parentId 都属于该作品（如果指定了）
    const parentIds = nodesToReorder
      .filter((n) => n.parentId)
      .map((n) => n.parentId!);

    if (parentIds.length > 0) {
      const parents = await this.prisma.outlineNode.findMany({
        where: {
          id: { in: parentIds },
          workId,
        },
      });

      if (parents.length !== parentIds.length) {
        throw new BadRequestException('Some parent nodes do not exist in this work');
      }
    }

    // 使用事务批量更新
    const results = await this.prisma.$transaction(
      nodesToReorder.map((item) =>
        this.prisma.outlineNode.update({
          where: { id: item.id },
          data: {
            order: item.order,
            parentId: item.parentId || null,
          },
        }),
      ),
    );

    return results;
  }
}
