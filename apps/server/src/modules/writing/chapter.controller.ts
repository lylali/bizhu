import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ChapterService } from './chapter.service';
import {
  CreateChapterRequest,
  UpdateChapterRequest,
  SaveChapterContentRequest,
  ChapterListResponse,
  ChapterResponse,
  ChapterWithContentResponse,
} from '@shared';

@Controller('works/:workId/chapters')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post()
  async createChapter(
    @Param('workId') workId: string,
    @Body() request: CreateChapterRequest,
  ): Promise<ChapterResponse> {
    return this.chapterService.createChapter(workId, request);
  }

  @Get()
  async getChapters(@Param('workId') workId: string): Promise<ChapterListResponse> {
    return this.chapterService.getChapters(workId);
  }

  @Get(':id')
  async getChapter(
    @Param('workId') workId: string,
    @Param('id') chapterId: string,
  ): Promise<ChapterWithContentResponse> {
    return this.chapterService.getChapter(workId, chapterId);
  }

  @Patch(':id')
  async updateChapter(
    @Param('workId') workId: string,
    @Param('id') chapterId: string,
    @Body() request: UpdateChapterRequest,
  ): Promise<ChapterResponse> {
    return this.chapterService.updateChapter(workId, chapterId, request);
  }

  @Delete(':id')
  async deleteChapter(
    @Param('workId') workId: string,
    @Param('id') chapterId: string,
  ): Promise<{ success: boolean }> {
    await this.chapterService.deleteChapter(workId, chapterId);
    return { success: true };
  }

  @Post(':id/save')
  async saveChapterContent(
    @Param('workId') workId: string,
    @Param('id') chapterId: string,
    @Body() request: SaveChapterContentRequest,
  ): Promise<ChapterResponse> {
    return this.chapterService.saveChapterContent(workId, chapterId, request);
  }
}