import React from 'react';
import { Character } from '@shared';
import { CharacterCard } from './CharacterCard';

interface CharacterListProps {
  characters: Character[];
  isLoading?: boolean;
  onCardClick?: (character: Character) => void;
  onCardDelete?: (characterId: string) => void;
  onCreateClick?: () => void;
}

export const CharacterList: React.FC<CharacterListProps> = ({
  characters,
  isLoading = false,
  onCardClick,
  onCardDelete,
  onCreateClick,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-500 mb-4 text-lg">还没有添加任何角色</p>
          <button
            onClick={onCreateClick}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            创建第一个角色
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          onClick={() => onCardClick?.(character)}
          onDelete={() => onCardDelete?.(character.id)}
        />
      ))}
    </div>
  );
};
