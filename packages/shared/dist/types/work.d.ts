export interface Work {
    id: string;
    title: string;
    description?: string;
    type: string;
    status: string;
    coverId?: string;
    totalWordCount: number;
    todayWordCount: number;
    streak: number;
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
//# sourceMappingURL=work.d.ts.map