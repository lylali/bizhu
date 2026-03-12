export declare class CreateCharacterDto {
    name: string;
    aliases?: string;
    gender?: string;
    age?: number;
    description?: string;
    appearance?: string;
    personality?: string;
    faction?: string;
    notes?: string;
    tags?: string[];
}
export declare class UpdateCharacterDto {
    name?: string;
    aliases?: string;
    gender?: string;
    age?: number;
    description?: string;
    appearance?: string;
    personality?: string;
    faction?: string;
    notes?: string;
    tags?: string[];
}
export declare class CreateCharacterRelationDto {
    fromId: string;
    toId: string;
    relationType: string;
}
export declare class UpdateCharacterPositionDto {
    x: number;
    y: number;
}
//# sourceMappingURL=character.dto.d.ts.map