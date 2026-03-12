import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Foreshadow, ForeshadowChapter } from '@shared';
import { ForeshadowFormData } from './useForeshadow';
import { chapterApi } from '../../api';

// 表单验证 schema
const foreshadowFormSchema = z.object({
  description: z.string().min(1, '伏笔描述不能为空'),
  plantedChapterId: z.string().min(1, '必须选择埋设章节'),
  expectedResolveChapterId: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']),
  notes: z.string().optional(),
});

type ForeshadowFormValues = z.infer<typeof foreshadowFormSchema>;

interface ChapterOption {
  id: string;
  title: string;
  order: number;
}

interface ForeshadowFormProps {
  foreshadow?: Foreshadow;
  workId: string;
  onSubmit: (data: ForeshadowFormData) => Promise<{ success: boolean; error?: string }>;
  isSaving?: boolean;
  onCancel?: () => void;
}

export const ForeshadowForm: React.FC<ForeshadowFormProps> = ({
  foreshadow,
  workId,
  onSubmit,
  isSaving = false,
  onCancel,
}) => {
  const [chapters, setChapters] = useState<ChapterOption[]>([]);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ForeshadowFormValues>({
    resolver: zodResolver(foreshadowFormSchema),
    defaultValues: {
      description: foreshadow?.description || '',
      plantedChapterId: foreshadow?.plantedChapterId || '',
      expectedResolveChapterId: foreshadow?.expectedResolveChapterId || '',
      priority: foreshadow?.priority || 'medium',
      notes: foreshadow?.notes || '',
    },
  });

  // 加载章节列表
  useEffect(() => {
    const loadChapters = async () => {
      setIsLoadingChapters(true);
      try {
        const response = await chapterApi.getAll(workId);
        const chapterOptions = response.data.map(chapter => ({
          id: chapter.id,
          title: chapter.title,
          order: chapter.order,
        }));
        setChapters(chapterOptions);
      } catch (error) {
        console.error('Failed to load chapters:', error);
      } finally {
        setIsLoadingChapters(false);
      }
    };

    loadChapters();
  }, [workId]);

  const onFormSubmit = async (data: ForeshadowFormValues) => {
    const formData: ForeshadowFormData = {
      description: data.description,
      plantedChapterId: data.plantedChapterId,
      expectedResolveChapterId: data.expectedResolveChapterId || undefined,
      priority: data.priority,
      notes: data.notes || undefined,
    };

    const result = await onSubmit(formData);
    if (result.success && !foreshadow) {
      // 创建成功后重置表单
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* 伏笔描述 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          伏笔描述 *
        </label>
        <textarea
          {...register('description')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="例如：提到主角腰间的玉佩"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* 埋设章节 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          埋设章节 *
        </label>
        <select
          {...register('plantedChapterId')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoadingChapters}
        >
          <option value="">
            {isLoadingChapters ? '加载中...' : '请选择章节'}
          </option>
          {chapters.map((chapter) => (
            <option key={chapter.id} value={chapter.id}>
              第{chapter.order}章 - {chapter.title}
            </option>
          ))}
        </select>
        {errors.plantedChapterId && (
          <p className="mt-1 text-sm text-red-600">{errors.plantedChapterId.message}</p>
        )}
      </div>

      {/* 预计回收章节 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          预计回收章节
        </label>
        <select
          {...register('expectedResolveChapterId')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoadingChapters}
        >
          <option value="">不指定</option>
          {chapters.map((chapter) => (
            <option key={chapter.id} value={chapter.id}>
              第{chapter.order}章 - {chapter.title}
            </option>
          ))}
        </select>
      </div>

      {/* 优先级 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          优先级
        </label>
        <select
          {...register('priority')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
      </div>

      {/* 备注 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          备注
        </label>
        <textarea
          {...register('notes')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={2}
          placeholder="可选的备注信息"
        />
      </div>

      {/* 按钮 */}
      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            取消
          </button>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? '保存中...' : foreshadow ? '更新' : '创建'}
        </button>
      </div>
    </form>
  );
};