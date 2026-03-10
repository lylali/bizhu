import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OutlineService } from './outline.service';
import {
  CreateOutlineNodeDto,
  UpdateOutlineNodeDto,
  ReorderOutlineDto,
  OutlineNodeResponseDto,
  OutlineTreeResponseDto,
} from './dto/outline.dto';

@Controller('works/:workId/outline')
@UseGuards(JwtAuthGuard)
export class OutlineController {
  constructor(private outlineService: OutlineService) {}

  /**
   * GET /works/:workId/outline
   * 获取完整大纲树
   */
  @Get()
  async getTree(@Param('workId') workId: string): Promise<OutlineTreeResponseDto> {
    // TODO: Add userId from JWT token
    return this.outlineService.getTree(workId, 'temp-user-id');
  }

  /**
   * POST /works/:workId/outline
   * 创建节点
   */
  @Post()
  async createNode(
    @Param('workId') workId: string,
    @Body() createDto: CreateOutlineNodeDto,
  ): Promise<OutlineNodeResponseDto> {
    // TODO: Add userId from JWT token
    return this.outlineService.createNode(workId, 'temp-user-id', createDto);
  }

  /**
   * PATCH /works/:workId/outline/:id
   * 更新节点
   */
  @Patch(':id')
  async updateNode(
    @Param('workId') workId: string,
    @Param('id') nodeId: string,
    @Body() updateDto: UpdateOutlineNodeDto,
  ): Promise<OutlineNodeResponseDto> {
    // TODO: Add userId from JWT token
    return this.outlineService.updateNode(workId, nodeId, 'temp-user-id', updateDto);
  }

  /**
   * DELETE /works/:workId/outline/:id
   * 删除节点（级联删除子节点）
   */
  @Delete(':id')
  @HttpCode(204)
  async deleteNode(
    @Param('workId') workId: string,
    @Param('id') nodeId: string,
  ): Promise<void> {
    // TODO: Add userId from JWT token
    await this.outlineService.deleteNode(workId, nodeId, 'temp-user-id');
  }

  /**
   * POST /works/:workId/outline/reorder
   * 批量更新节点顺序（拖拽后调用）
   */
  @Post('reorder')
  async reorderNodes(
    @Param('workId') workId: string,
    @Body() reorderDto: ReorderOutlineDto,
  ): Promise<OutlineNodeResponseDto[]> {
    // TODO: Add userId from JWT token
    return this.outlineService.reorderNodes(workId, 'temp-user-id', reorderDto.nodes);
  }
}
