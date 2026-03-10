import { WorkListResponse, WorkStatsResponse, CreateWorkRequest, WorkResponse } from '@shared';

const API_BASE = '/api';

export const workApi = {
  createWork: async (request: CreateWorkRequest): Promise<WorkResponse> => {
    const response = await fetch(`${API_BASE}/works`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error('创建作品失败');
    }
    return response.json();
  },

  getWorks: async (): Promise<WorkListResponse> => {
    const response = await fetch(`${API_BASE}/works`);
    if (!response.ok) {
      throw new Error('获取作品列表失败');
    }
    return response.json();
  },

  getWorkStats: async (workId: string): Promise<WorkStatsResponse> => {
    const response = await fetch(`${API_BASE}/works/${workId}/stats`);
    if (!response.ok) {
      throw new Error('获取作品统计失败');
    }
    return response.json();
  },
};