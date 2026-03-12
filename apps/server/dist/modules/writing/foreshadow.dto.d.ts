export declare class CreateForeshadowDto {
    description: string;
    plantedChapterId: string;
    expectedResolveChapterId?: string;
    priority?: 'high' | 'medium' | 'low';
    notes?: string;
}
export declare class UpdateForeshadowDto {
    description?: string;
    plantedChapterId?: string;
    expectedResolveChapterId?: string;
    isResolved?: boolean;
    priority?: 'high' | 'medium' | 'low';
    notes?: string;
}
//# sourceMappingURL=foreshadow.dto.d.ts.map