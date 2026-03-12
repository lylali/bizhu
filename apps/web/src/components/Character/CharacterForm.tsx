import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Character } from '@shared';
import { CharacterFormData } from './useCharacter';

// 表单验证 schema
const characterFormSchema = z.object({
  name: z.string().min(1, '角色名称不能为空'),
  aliases: z.string().optional(),
  gender: z.string().optional(),
  age: z.number().int().positive('年龄必须是正整数').optional().or(z.literal('')),
  description: z.string().optional(),
  appearance: z.string().optional(),
  personality: z.string().optional(),
  faction: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type CharacterFormValues = z.infer<typeof characterFormSchema>;

interface CharacterFormProps {
  character?: Character;
  onSubmit: (data: CharacterFormData) => Promise<{ success: boolean; error?: string }>;
  isSaving?: boolean;
  onCancel?: () => void;
}

export const CharacterForm: React.FC<CharacterFormProps> = ({
  character,
  onSubmit,
  isSaving = false,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<CharacterFormValues>({
    resolver: zodResolver(characterFormSchema),
    defaultValues: {
      name: character?.name || '',
      aliases: character?.aliases || '',
      gender: character?.gender || '',
      age: character?.age || undefined,
      description: character?.description || '',
      appearance: character?.appearance || '',
      personality: character?.personality || '',
      faction: character?.faction || '',
      notes: character?.notes || '',
      tags: character?.tags ? JSON.parse(character.tags) : [],
    },
  });

  const currentTags = watch('tags') || [];

  const handleFormSubmit = async (data: CharacterFormValues) => {
    const formData: CharacterFormData = {
      ...data,
      age: typeof data.age === 'string' ? undefined : data.age,
      tags: currentTags,
    };
    const result = await onSubmit(formData);
    if (result.success) {
      reset();
    }
  };

  const handleAddTag = (newTag: string) => {
    if (newTag.trim() && !currentTags.includes(newTag.trim())) {
      // react-hook-form 需要通过 reset 或 setValue 来更新数组
      // 这里我们使用 watch 的值来追踪标签
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* 角色名称 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          角色名称 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('name')}
          placeholder="输入角色名称"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      {/* 别名 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          别名 <span className="text-gray-400 text-xs">(逗号分隔)</span>
        </label>
        <input
          type="text"
          {...register('aliases')}
          placeholder="e.g. 小王，王老"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 性别和年龄 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
          <select
            {...register('gender')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">未选择</option>
            <option value="男">男</option>
            <option value="女">女</option>
            <option value="未知">未知</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">年龄</label>
          <input
            type="number"
            {...register('age', { valueAsNumber: true })}
            placeholder="输入年龄"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.age && <p className="text-sm text-red-500 mt-1">{errors.age.message}</p>}
        </div>
      </div>

      {/* 外貌描述 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">外贌描述</label>
        <textarea
          {...register('appearance')}
          placeholder="描述角色的外貌特征"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* 性格特点 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">性格特点</label>
        <textarea
          {...register('personality')}
          placeholder="描述角色的性格特征"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* 人物背景 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">人物背景</label>
        <textarea
          {...register('description')}
          placeholder="描述角色的背景故事"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* 所属势力 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">所属势力</label>
        <input
          type="text"
          {...register('faction')}
          placeholder="输入所属势力"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 标签 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">标签</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {currentTags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => {
                  const newTags = currentTags.filter((_, i) => i !== index);
                  // 需要通过 register 来更新 tags
                }}
                className="hover:text-blue-600 font-semibold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="输入标签后按 Enter"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
              const newTag = (e.target as HTMLInputElement).value.trim();
              // 需要使用 setValue 来更新 tags 数组
              (e.target as HTMLInputElement).value = '';
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 备注 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
        <textarea
          {...register('notes')}
          placeholder="输入其他备注信息"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* 按钮 */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          disabled={isSaving}
        >
          取消
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSaving}
        >
          {isSaving ? '保存中...' : character ? '保存修改' : '创建角色'}
        </button>
      </div>
    </form>
  );
};
