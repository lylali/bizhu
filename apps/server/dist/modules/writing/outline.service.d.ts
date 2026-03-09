import { PrismaService } from '../../prisma/prisma.service';
import { CreateOutlineNodeDto, UpdateOutlineNodeDto, ReorderOutlineNodeDto } from './dto/outline.dto';
import type { OutlineNode } from '@prisma/client';
export declare class OutlineService {
    private prisma;
    constructor(prisma: PrismaService);
    /**
     * 递归构建树形结构
     */
    private buildTree;
    /**
     * 获取完整大纲树
     */
    getTree(workId: string, userId: string): Promise<{
        workId: string;
        roots: {
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            workId: string;
            order: number;
            content: string | null;
            chapterId: string | null;
            parentId: string | null;
        }[];
    }>;
    /**
     * 创建大纲节点
     */
    createNode(workId: string, userId: string, createDto: CreateOutlineNodeDto): Promise<OutlineNode>;
    /**
     * 更新大纲节点
     */
    updateNode(workId: string, nodeId: string, userId: string, updateDto: UpdateOutlineNodeDto): Promise<OutlineNode>;
    /**
     * 删除大纲节点（自动级联删除子节点）
     */
    deleteNode(workId: string, nodeId: string, userId: string): Promise<OutlineNode>;
    /**
     * 批量更新节点顺序（用事务保证原子性）
     */
    reorderNodes(workId: string, userId: string, nodesToReorder: ReorderOutlineNodeDto[]): Promise<OutlineNode[]>;
}
//# sourceMappingURL=outline.service.d.ts.map