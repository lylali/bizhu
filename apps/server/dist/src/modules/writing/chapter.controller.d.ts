import { ChapterService } from './chapter.service';
import { CreateChapterRequest, UpdateChapterRequest, SaveChapterContentRequest, ChapterListResponse, ChapterResponse, ChapterWithContentResponse } from '@shared/types/chapter';
export declare class ChapterController {
    private readonly chapterService;
    constructor(chapterService: ChapterService);
    createChapter(workId: string, request: CreateChapterRequest): Promise<ChapterResponse>;
    getChapters(workId: string): Promise<ChapterListResponse>;
    getChapter(workId: string, chapterId: string): Promise<ChapterWithContentResponse>;
    updateChapter(workId: string, chapterId: string, request: UpdateChapterRequest): Promise<ChapterResponse>;
    deleteChapter(workId: string, chapterId: string): Promise<{
        success: boolean;
    }>;
    saveChapterContent(workId: string, chapterId: string, request: SaveChapterContentRequest): Promise<ChapterResponse>;
}
//# sourceMappingURL=chapter.controller.d.ts.map