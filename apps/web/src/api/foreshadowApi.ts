import {
  Foreshadow,
  ForeshadowListResponse,
  ForeshadowResponse,
  CreateForeshadowRequest,
  UpdateForeshadowRequest,
} from '@shared';
import { request } from './request';

export const foreshadowApi = {
  // 获取作品的所有伏笔
  getAll: (workId: string) =>
    request<ForeshadowListResponse>('GET', `/works/${workId}/foreshadows`),

  // 创建伏笔
  create: (workId: string, data: CreateForeshadowRequest) =>
    request<ForeshadowResponse>('POST', `/works/${workId}/foreshadows`, data),

  // 更新伏笔
  update: (workId: string, foreshadowId: string, data: UpdateForeshadowRequest) =>
    request<ForeshadowResponse>('PATCH', `/works/${workId}/foreshadows/${foreshadowId}`, data),

  // 删除伏笔
  delete: (workId: string, foreshadowId: string) =>
    request<void>('DELETE', `/works/${workId}/foreshadows/${foreshadowId}`),
};