// 伏笔追踪相关类型定义

export interface Foreshadow {
  id: string;
  workId: string;
  description: string;
  plantedChapterId: string | null;
  plantedChapter?: ForeshadowChapter | null;
  expectedResolveChapterId: string | null;
  expectedResolveChapter?: ForeshadowChapter | null;
  isResolved: boolean;
  priority?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForeshadowChapter {
  id: string;
  title: string;
  order: number;
}

// 请求 DTO
export interface CreateForeshadowRequest {
  description: string;
  plantedChapterId: string;
  expectedResolveChapterId?: string;
  priority?: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface UpdateForeshadowRequest {
  description?: string;
  plantedChapterId?: string;
  expectedResolveChapterId?: string;
  isResolved?: boolean;
  priority?: 'high' | 'medium' | 'low';
  notes?: string;
}

// 响应 DTO
export interface ForeshadowListResponse {
  data: Foreshadow[];
}

export interface ForeshadowResponse {
  data: Foreshadow;
}