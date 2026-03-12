import { useState, useCallback } from 'react';
import { Character, CharacterRelation, CreateCharacterRequest, UpdateCharacterRequest } from '@shared';
import { characterApi } from '@/api';

export interface CharacterFormData extends CreateCharacterRequest {
  tags?: string[];
}

export const useCharacter = (workId: string) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [relations, setRelations] = useState<CharacterRelation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取所有角色和关系
  const loadCharacters = useCallback(async () => {
    if (!workId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [charactersResponse, relationsResponse] = await Promise.all([
        characterApi.getAll(workId),
        characterApi.getAllRelations(workId),
      ]);

      if (charactersResponse && charactersResponse.data) {
        setCharacters(charactersResponse.data);
      }

      if (relationsResponse && relationsResponse.data) {
        setRelations(relationsResponse.data);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载角色列表失败';
      setError(message);
      console.error('Failed to load characters:', err);
    } finally {
      setIsLoading(false);
    }
  }, [workId]);

  // 创建角色
  const createCharacter = useCallback(
    async (data: CharacterFormData) => {
      if (!workId) return;
      setIsSaving(true);
      setError(null);
      try {
        // 将 tags 数组转换为 JSON 字符串用于 API
        const apiData: CreateCharacterRequest = {
          ...data,
          tags: data.tags,
        };
        await characterApi.create(workId, apiData);
        await loadCharacters();
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : '创建角色失败';
        setError(message);
        console.error('Failed to create character:', err);
        return { success: false, error: message };
      } finally {
        setIsSaving(false);
      }
    },
    [workId, loadCharacters]
  );

  // 更新角色
  const updateCharacter = useCallback(
    async (characterId: string, data: CharacterFormData) => {
      if (!workId) return;
      setIsSaving(true);
      setError(null);
      try {
        const apiData: UpdateCharacterRequest = {
          ...data,
          tags: data.tags,
        };
        await characterApi.update(workId, characterId, apiData);
        await loadCharacters();
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : '更新角色失败';
        setError(message);
        console.error('Failed to update character:', err);
        return { success: false, error: message };
      } finally {
        setIsSaving(false);
      }
    },
    [workId, loadCharacters]
  );

  // 删除角色
  const deleteCharacter = useCallback(
    async (characterId: string) => {
      if (!workId) return;
      setIsSaving(true);
      setError(null);
      try {
        await characterApi.delete(workId, characterId);
        await loadCharacters();
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : '删除角色失败';
        setError(message);
        console.error('Failed to delete character:', err);
        return { success: false, error: message };
      } finally {
        setIsSaving(false);
      }
    },
    [workId, loadCharacters]
  );

  // 删除关系
  const deleteRelation = useCallback(
    async (relationId: string) => {
      if (!workId) return;
      setIsSaving(true);
      setError(null);
      try {
        await characterApi.deleteRelation(workId, relationId);
        await loadCharacters();
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : '删除关系失败';
        setError(message);
        console.error('Failed to delete relation:', err);
        return { success: false, error: message };
      } finally {
        setIsSaving(false);
      }
    },
    [workId, loadCharacters]
  );

  return {
    characters,
    relations,
    isLoading,
    isSaving,
    error,
    loadCharacters,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    deleteRelation,
  };
};
