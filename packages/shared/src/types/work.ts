// 作品相关类型定义

export interface Work {
  id: string;
  title: string;
  description?: string;
  type: string; // 长篇 | 短篇 | 剧本 | 短剧
  status: string; // draft | publishing | completed
  coverId?: string;
  totalWordCount: number;
  todayWordCount: number;
  streak: number; // 连续更新天数
  chapterCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWorkRequest {
  title: string;
  description?: string;
  type: string;
}

export interface WorkStats {
  totalWordCount: number;
  todayWordCount: number;
  streak: number;
  chapterCount: number;
}

export interface WorkListResponse {
  data: Work[];
  meta: {
    total: number;
  };
}

export interface WorkStatsResponse {
  data: WorkStats;
}

export interface WorkResponse {
  data: Work;
}