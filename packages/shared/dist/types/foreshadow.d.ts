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
export interface ForeshadowListResponse {
    data: Foreshadow[];
}
export interface ForeshadowResponse {
    data: Foreshadow;
}
//# sourceMappingURL=foreshadow.d.ts.map