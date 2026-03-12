import React from 'react';
import { Character } from '@shared';

interface CharacterCardProps {
  character: Character;
  onClick?: () => void;
  onDelete?: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onClick,
  onDelete,
}) => {
  return (
    <div
      onClick={onClick}
      className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
    >
      {/* 头部：名字和标签 */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{character.name}</h3>
          {character.aliases && (
            <p className="text-xs text-gray-500">别名：{character.aliases}</p>
          )}
        </div>
        {character.gender && (
          <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">
            {character.gender}
          </span>
        )}
      </div>

      {/* 基本信息 */}
      <div className="space-y-1 mb-3 text-sm text-gray-600">
        {character.appearance && (
          <p className="truncate">
            <span className="font-medium">外貌：</span>
            {character.appearance}
          </p>
        )}
        {character.personality && (
          <p className="truncate">
            <span className="font-medium">性格：</span>
            {character.personality}
          </p>
        )}
        {character.faction && (
          <p className="truncate">
            <span className="font-medium">势力：</span>
            {character.faction}
          </p>
        )}
      </div>

      {/* 标签 */}
      {character.tags && (
        <div className="mb-3 flex flex-wrap gap-1">
          {(() => {
            try {
              const tags = JSON.parse(character.tags);
              if (Array.isArray(tags)) {
                return tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded"
                  >
                    {tag}
                  </span>
                ));
              }
            } catch {
              // tags 不是有效的 JSON，忽略
            }
            return null;
          })()}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="flex-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
        >
          编辑
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('确定要删除此角色吗？')) {
              onDelete?.();
            }
          }}
          className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
        >
          删除
        </button>
      </div>
    </div>
  );
};
