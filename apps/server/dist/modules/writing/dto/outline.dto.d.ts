export declare class CreateOutlineNodeDto {
    title: string;
    content?: string;
    parentId?: string;
    order?: number;
    chapterId?: string;
}
export declare class UpdateOutlineNodeDto {
    title?: string;
    content?: string;
    order?: number;
    chapterId?: string;
}
export declare class ReorderOutlineNodeDto {
    id: string;
    parentId?: string | null;
    order: number;
}
export declare class ReorderOutlineDto {
    nodes: ReorderOutlineNodeDto[];
}
export declare class OutlineNodeResponseDto {
    id: string;
    title: string;
    content: string | null;
    order: number;
    parentId: string | null;
    chapterId: string | null;
    children?: OutlineNodeResponseDto[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class OutlineTreeResponseDto {
    workId: string;
    roots: OutlineNodeResponseDto[];
}
//# sourceMappingURL=outline.dto.d.ts.map