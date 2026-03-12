import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Character } from '@shared';
import { useCharacterStore } from '../../../stores/characterStore';

interface CharacterMentionComponentProps {
  node: {
    attrs: {
      id: string;
      label: string;
    };
  };
  extension: any;
}

export const CharacterMentionComponent: React.FC<CharacterMentionComponentProps> = ({
  node,
  extension,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { id, label } = node.attrs;

  // 从store获取角色信息
  const characters = useCharacterStore((state) => state.characters);
  const character = characters.find(char => char.id === id);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <NodeViewWrapper
      as="span"
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        className="inline-block px-1 py-0.5 mx-0.5 rounded text-blue-800 bg-blue-100 hover:bg-blue-200 cursor-pointer transition-colors"
        data-id={id}
        data-label={label}
      >
        <NodeViewContent as="span" />
      </span>

      {/* Tooltip */}
      {showTooltip && character && (
        <div className="absolute z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap">
          <div className="font-medium">{character.name}</div>
          <div className="text-gray-300 text-xs mt-1">
            {character.gender && `${character.gender} · `}
            {character.personality && character.personality.split('。')[0]}
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </NodeViewWrapper>
  );
};