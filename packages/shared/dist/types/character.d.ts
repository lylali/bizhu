export interface Character {
    id: string;
    workId: string;
    name: string;
    aliases?: string;
    gender?: string;
    age?: number;
    description?: string;
    appearance?: string;
    personality?: string;
    faction?: string;
    notes?: string;
    tags?: string;
    positionX: number;
    positionY: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface CharacterWithRelations extends Character {
    relationsFrom: CharacterRelation[];
    relationsTo: CharacterRelation[];
}
export interface CharacterRelation {
    id: string;
    workId: string;
    fromId: string;
    from?: Character;
    toId: string;
    to?: Character;
    relationType: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateCharacterRequest {
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
export interface UpdateCharacterRequest {
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
export interface CreateCharacterRelationRequest {
    fromId: string;
    toId: string;
    relationType: string;
}
export interface UpdateCharacterPositionRequest {
    x: number;
    y: number;
}
export interface CharacterResponse {
    data: Character;
}
export interface CharacterWithRelationsResponse {
    data: CharacterWithRelations;
}
export interface CharacterListResponse {
    data: Character[];
    meta: {
        total: number;
    };
}
export interface CharacterRelationResponse {
    data: CharacterRelation;
}
export interface CharacterRelationListResponse {
    data: CharacterRelation[];
}
//# sourceMappingURL=character.d.ts.map