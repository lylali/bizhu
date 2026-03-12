// 角色卡相关类型定义

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
  tags?: string; // JSON 格式字符串数组
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

// 请求 DTO
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

// 响应格式
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