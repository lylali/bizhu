import React from 'react';
import { Character } from '@shared';
import { CharacterForm } from './CharacterForm';
import { CharacterFormData } from './useCharacter';

interface CharacterDrawerProps {
  isOpen: boolean;
  character?: Character;
  isSaving?: boolean;
  onSubmit: (data: CharacterFormData) => Promise<{ success: boolean; error?: string }>;
  onClose: () => void;
}

export const CharacterDrawer: React.FC<CharacterDrawerProps> = ({
  isOpen,
  character,
  isSaving = false,
  onSubmit,
  onClose,
}) => {
  // 同时显示：创建模式为没有 character
  const isCreateMode = !character;
  const title = isCreateMode ? '创建新角色' : '编辑角色';

  return (
    <>
      {/* 遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* 抽屉 */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* 头部 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* 表单 */}
          <CharacterForm
            character={character}
            onSubmit={onSubmit}
            isSaving={isSaving}
            onCancel={onClose}
          />
        </div>
      </div>
    </>
  );
};
