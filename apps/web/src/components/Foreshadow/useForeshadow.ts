import { useState, useCallback } from 'react';
import { Foreshadow, CreateForeshadowRequest, UpdateForeshadowRequest } from '@shared';
import { foreshadowApi } from '../../api';

export interface ForeshadowFormData {
  description: string;
  plantedChapterId: string;
  expectedResolveChapterId?: string;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface UseForeshadowOptions {
  workId: string;
}

export function useForeshadow({ workId }: UseForeshadowOptions) {
  const [foreshadows, setForeshadows] = useState<Foreshadow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载伏笔列表
  const loadForeshadows = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await foreshadowApi.getAll(workId);
      setForeshadows(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载伏笔失败');
      console.error('Failed to load foreshadows:', err);
    } finally {
      setIsLoading(false);
    }
  }, [workId]);

  // 创建伏笔
  const createForeshadow = useCallback(async (data: ForeshadowFormData) => {
    setIsSaving(true);
    setError(null);
    try {
      const request: CreateForeshadowRequest = {
        description: data.description,
        plantedChapterId: data.plantedChapterId,
        expectedResolveChapterId: data.expectedResolveChapterId,
        priority: data.priority,
        notes: data.notes,
      };

      const response = await foreshadowApi.create(workId, request);
      setForeshadows(prev => [response.data, ...prev]);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '创建伏笔失败';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSaving(false);
    }
  }, [workId]);

  // 更新伏笔
  const updateForeshadow = useCallback(async (foreshadowId: string, data: Partial<ForeshadowFormData>) => {
    setIsSaving(true);
    setError(null);
    try {
      const request: UpdateForeshadowRequest = {
        description: data.description,
        plantedChapterId: data.plantedChapterId,
        expectedResolveChapterId: data.expectedResolveChapterId,
        priority: data.priority,
        notes: data.notes,
      };

      const response = await foreshadowApi.update(workId, foreshadowId, request);
      setForeshadows(prev =>
        prev.map(f => f.id === foreshadowId ? response.data : f)
      );
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新伏笔失败';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSaving(false);
    }
  }, [workId]);

  // 快速标记为已回收
  const markResolved = useCallback(async (foreshadowId: string, isResolved: boolean) => {
    try {
      const response = await foreshadowApi.update(workId, foreshadowId, { isResolved });
      setForeshadows(prev =>
        prev.map(f => f.id === foreshadowId ? response.data : f)
      );
      return { success: true };
    } catch (err) {
      console.error('Failed to mark foreshadow resolved:', err);
      return { success: false, error: err instanceof Error ? err.message : '操作失败' };
    }
  }, [workId]);

  // 删除伏笔
  const deleteForeshadow = useCallback(async (foreshadowId: string) => {
    try {
      await foreshadowApi.delete(workId, foreshadowId);
      setForeshadows(prev => prev.filter(f => f.id !== foreshadowId));
      return { success: true };
    } catch (err) {
      console.error('Failed to delete foreshadow:', err);
      return { success: false, error: err instanceof Error ? err.message : '删除失败' };
    }
  }, [workId]);

  return {
    foreshadows,
    isLoading,
    isSaving,
    error,
    loadForeshadows,
    createForeshadow,
    updateForeshadow,
    markResolved,
    deleteForeshadow,
  };
}