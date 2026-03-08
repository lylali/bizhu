import { PrismaService } from '../../prisma/prisma.service';
import { CreateChapterRequest, UpdateChapterRequest, SaveChapterContentRequest, ChapterListResponse, ChapterResponse, ChapterWithContentResponse } from '@shared/types/chapter';
export declare class ChapterService {
    private prisma;
    constructor(prisma: PrismaService);
    private validateWorkOwnership;
    private calculateWordCount;
    createChapter(workId: string, request: CreateChapterRequest): Promise<ChapterResponse>;
    getChapters(workId: string): Promise<ChapterListResponse>;
    getChapter(workId: string, chapterId: string): Promise<ChapterWithContentResponse>;
    updateChapter(workId: string, chapterId: string, request: UpdateChapterRequest): Promise<ChapterResponse>;
    deleteChapter(workId: string, chapterId: string): Promise<void>;
    saveChapterContent(workId: string, chapterId: string, request: SaveChapterContentRequest): Promise<ChapterResponse>;
}
//# sourceMappingURL=chapter.service.d.ts.map