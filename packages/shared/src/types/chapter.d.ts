export interface Chapter {
    id: string;
    workId: string;
    title: string;
    order: number;
    wordCount: number;
    publishStatus: 'draft' | 'published' | 'archived';
    createdAt: string;
    updatedAt: string;
}
export interface ChapterWithContent extends Chapter {
    yjsDoc?: Buffer;
    textSnapshot?: string;
}
export interface CreateChapterRequest {
    title: string;
    order?: number;
}
export interface UpdateChapterRequest {
    title?: string;
    order?: number;
    publishStatus?: 'draft' | 'published' | 'archived';
}
export interface SaveChapterContentRequest {
    yjsDoc: Buffer;
    textSnapshot: string;
}
export interface ChapterListResponse {
    data: Chapter[];
    meta: {
        total: number;
        workId: string;
    };
}
export interface ChapterResponse {
    data: Chapter;
    meta: object;
}
export interface ChapterWithContentResponse {
    data: ChapterWithContent;
    meta: object;
}
//# sourceMappingURL=chapter.d.ts.map