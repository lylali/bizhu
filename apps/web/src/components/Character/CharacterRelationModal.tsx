import React, { useState } from 'react';
import { Character, CreateCharacterRelationRequest } from '@shared';
import { characterApi } from '@/api';

interface CharacterRelationModalProps {
  isOpen: boolean;
  characters: Character[];
  workId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const RELATION_TYPES = [
  { value: '朋友', label: '朋友' },
  { value: '敌人', label: '敌人' },
  { value: '师徒', label: '师徒' },
  { value: '恋人', label: '恋人' },
  { value: '亲属', label: '亲属' },
  { value: '其他', label: '其他' },
];

export const CharacterRelationModal: React.FC<CharacterRelationModalProps> = ({
  isOpen,
  characters,
  workId,
  onClose,
  onSuccess,
}) => {
  const [fromCharacter, setFromCharacter] = useState('');
  const [toCharacter, setToCharacter] = useState('');
  const [relationType, setRelationType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromCharacter || !toCharacter || !relationType) {
      setError('请选择两个角色和关系类型');
      return;
    }

    if (fromCharacter === toCharacter) {
      setError('不能选择同一个角色');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const data: CreateCharacterRelationRequest = {
        fromId: fromCharacter,
        toId: toCharacter,
        relationType,
      };

      await characterApi.createRelation(workId, data);
      onSuccess();
      onClose();
      // 重置表单
      setFromCharacter('');
      setToCharacter('');
      setRelationType('');
    } catch (err) {
      const message = err instanceof Error ? err.message : '创建关系失败';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setFromCharacter('');
      setToCharacter('');
      setRelationType('');
      setError('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">添加角色关系</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 角色A选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              角色A
            </label>
            <select
              value={fromCharacter}
              onChange={(e) => setFromCharacter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">选择角色</option>
              {characters.map((character) => (
                <option key={character.id} value={character.id}>
                  {character.name}
                </option>
              ))}
            </select>
          </div>

          {/* 关系类型选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              关系类型
            </label>
            <select
              value={relationType}
              onChange={(e) => setRelationType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">选择关系类型</option>
              {RELATION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* 角色B选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              角色B
            </label>
            <select
              value={toCharacter}
              onChange={(e) => setToCharacter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">选择角色</option>
              {characters.map((character) => (
                <option key={character.id} value={character.id}>
                  {character.name}
                </option>
              ))}
            </select>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          {/* 按钮 */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? '创建中...' : '创建关系'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};