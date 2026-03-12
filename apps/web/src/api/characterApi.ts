import {
  Character,
  CharacterWithRelations,
  CharacterListResponse,
  CharacterWithRelationsResponse,
  CreateCharacterRequest,
  UpdateCharacterRequest,
  CreateCharacterRelationRequest,
  UpdateCharacterPositionRequest,
  CharacterRelation,
} from '@shared';
import { request } from './request';

export const characterApi = {
  // 获取作品的所有角色
  getAll: (workId: string) =>
    request<CharacterListResponse>('GET', `/works/${workId}/characters`),

  // 获取作品的所有角色关系
  getAllRelations: (workId: string) =>
    request<{ data: CharacterRelation[] }>('GET', `/works/${workId}/characters/relations`),

  // 创建角色
  create: (workId: string, data: CreateCharacterRequest) =>
    request<Character>('POST', `/works/${workId}/characters`, data),

  // 获取单个角色（含关系）
  getById: (workId: string, characterId: string) =>
    request<CharacterWithRelationsResponse>(
      'GET',
      `/works/${workId}/characters/${characterId}`
    ),

  // 更新角色信息
  update: (
    workId: string,
    characterId: string,
    data: UpdateCharacterRequest
  ) =>
    request<Character>(
      'PATCH',
      `/works/${workId}/characters/${characterId}`,
      data
    ),

  // 删除角色
  delete: (workId: string, characterId: string) =>
    request<void>('DELETE', `/works/${workId}/characters/${characterId}`),

  // 更新角色位置（用于关系图拖拽）
  updatePosition: (
    workId: string,
    characterId: string,
    data: UpdateCharacterPositionRequest
  ) =>
    request<Character>(
      'PATCH',
      `/works/${workId}/characters/${characterId}/position`,
      data
    ),

  // 创建角色关系
  createRelation: (workId: string, data: CreateCharacterRelationRequest) =>
    request<CharacterRelation>(
      'POST',
      `/works/${workId}/characters/relations`,
      data
    ),

  // 删除关系
  deleteRelation: (workId: string, relationId: string) =>
    request<void>(
      'DELETE',
      `/works/${workId}/characters/relations/${relationId}`
    ),
};
