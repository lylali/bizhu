import * as api from './index';
import type {
  CreateOutlineNodeDto,
  UpdateOutlineNodeDto,
  ReorderOutlineNodeDto,
} from '@shared';

export const outlineApi = {
  /**
   * 获取完整大纲树
   */
  async getTree(workId: string) {
    return api.request<any>(
      'GET',
      `/works/${workId}/outline`
    );
  },

  /**
   * 创建大纲节点
   */
  async createNode(workId: string, data: CreateOutlineNodeDto) {
    return api.request<any>(
      'POST',
      `/works/${workId}/outline`,
      data
    );
  },

  /**
   * 更新大纲节点
   */
  async updateNode(workId: string, nodeId: string, data: UpdateOutlineNodeDto) {
    return api.request<any>(
      'PATCH',
      `/works/${workId}/outline/${nodeId}`,
      data
    );
  },

  /**
   * 删除大纲节点
   */
  async deleteNode(workId: string, nodeId: string) {
    return api.request<void>(
      'DELETE',
      `/works/${workId}/outline/${nodeId}`
    );
  },

  /**
   * 批量更新节点顺序（拖拽后调用）
   */
  async reorderNodes(workId: string, nodes: ReorderOutlineNodeDto[]) {
    return api.request<any>(
      'POST',
      `/works/${workId}/outline/reorder`,
      { nodes }
    );
  },
};
