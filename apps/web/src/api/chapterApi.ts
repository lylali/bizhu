import { request } from './request';
import type {
  Chapter,
  CreateChapterRequest,
  UpdateChapterRequest,
  SaveChapterContentRequest,
  ChapterListResponse,
  ChapterResponse,
  ChapterWithContentResponse,
} from '@shared';

/**
 * 创建章节
 */
export async function createChapter(
  workId: string,
  data: CreateChapterRequest
): Promise<Chapter> {
  return request<Chapter>(
    'POST',
    `/works/${workId}/chapters`,
    data
  );
}

/**
 * 获取作品所有章节（不含正文）
 */
export async function getChapters(workId: string): Promise<Chapter[]> {
  const response = await request<ChapterListResponse>(
    'GET',
    `/works/${workId}/chapters`
  );
  return response.data;
}

/**
 * 获取单个章节（含正文）
 */
export async function getChapter(
  workId: string,
  chapterId: string
): Promise<Chapter> {
  return request<Chapter>(
    'GET',
    `/works/${workId}/chapters/${chapterId}`
  );
}

/**
 * 更新章节元数据
 */
export async function updateChapter(
  workId: string,
  chapterId: string,
  data: UpdateChapterRequest
): Promise<Chapter> {
  return request<Chapter>(
    'PATCH',
    `/works/${workId}/chapters/${chapterId}`,
    data
  );
}

/**
 * 删除章节
 */
export async function deleteChapter(workId: string, chapterId: string): Promise<void> {
  await request(
    'DELETE',
    `/works/${workId}/chapters/${chapterId}`
  );
}

/**
 * 保存章节内容（Yjs 文档 + 文本快照）
 */
export async function saveChapterContent(
  workId: string,
  chapterId: string,
  data: SaveChapterContentRequest
): Promise<Chapter> {
  return request<Chapter>(
    'POST',
    `/works/${workId}/chapters/${chapterId}/save`,
    data
  );
}
