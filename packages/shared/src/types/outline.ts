export interface OutlineNode {
  id: string;
  workId: string;
  title: string;
  content?: string;
  order: number;
  parentId?: string | null;
  chapterId?: string | null;
  children?: OutlineNode[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOutlineNodeDto {
  title: string;
  content?: string;
  parentId?: string;
  chapterId?: string;
  order?: number;
}

export interface UpdateOutlineNodeDto {
  title?: string;
  content?: string;
  order?: number;
  chapterId?: string;
}

export interface ReorderOutlineNodeDto {
  id: string;
  parentId?: string | null;
  order: number;
}

export interface OutlineTreeResponse {
  workId: string;
  roots: OutlineNode[];
}
