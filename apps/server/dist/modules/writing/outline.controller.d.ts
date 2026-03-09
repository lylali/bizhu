import { OutlineService } from './outline.service';
import { CreateOutlineNodeDto, UpdateOutlineNodeDto, ReorderOutlineDto, OutlineNodeResponseDto, OutlineTreeResponseDto } from './dto/outline.dto';
export declare class OutlineController {
    private outlineService;
    constructor(outlineService: OutlineService);
    /**
     * GET /works/:workId/outline
     * 获取完整大纲树
     */
    getTree(workId: string): Promise<OutlineTreeResponseDto>;
    /**
     * POST /works/:workId/outline
     * 创建节点
     */
    createNode(workId: string, createDto: CreateOutlineNodeDto): Promise<OutlineNodeResponseDto>;
    /**
     * PATCH /works/:workId/outline/:id
     * 更新节点
     */
    updateNode(workId: string, nodeId: string, updateDto: UpdateOutlineNodeDto): Promise<OutlineNodeResponseDto>;
    /**
     * DELETE /works/:workId/outline/:id
     * 删除节点（级联删除子节点）
     */
    deleteNode(workId: string, nodeId: string): Promise<void>;
    /**
     * POST /works/:workId/outline/reorder
     * 批量更新节点顺序（拖拽后调用）
     */
    reorderNodes(workId: string, reorderDto: ReorderOutlineDto): Promise<OutlineNodeResponseDto[]>;
}
//# sourceMappingURL=outline.controller.d.ts.map