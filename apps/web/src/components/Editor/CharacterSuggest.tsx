import React, { useEffect, useImperativeHandle, useState, forwardRef, useMemo } from 'react';
import { Character } from '@shared';

export interface CharacterSuggestProps {
  items: Character[];
  command: (item: { id: string; label: string }) => void;
  query?: string;
}

export interface CharacterSuggestRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export const CharacterSuggest = forwardRef<CharacterSuggestRef, CharacterSuggestProps>(
  ({ items, command, query = '' }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // 过滤角色列表
    const filteredCharacters = useMemo(() => {
      if (!query) return items;

      const term = query.toLowerCase();
      return items.filter(character => {
        const name = character.name.toLowerCase();
        const aliases = character.aliases?.toLowerCase() || '';

        // 支持汉字和拼音搜索
        return name.includes(term) || aliases.includes(term);
      });
    }, [items, query]);

    // 选择角色
    const selectItem = (character: Character) => {
      command({
        id: character.id,
        label: character.name,
      });
    };

    // 键盘事件处理
    const onKeyDown = ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + filteredCharacters.length - 1) % filteredCharacters.length);
        return true;
      }

      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % filteredCharacters.length);
        return true;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        if (filteredCharacters[selectedIndex]) {
          selectItem(filteredCharacters[selectedIndex]);
        }
        return true;
      }

      if (event.key === 'Escape') {
        return true; // 让父组件处理关闭
      }

      return false;
    };

    useImperativeHandle(ref, () => ({
      onKeyDown,
    }));

    // 重置选择索引当items改变时
    useEffect(() => {
      setSelectedIndex(0);
    }, [query]);

    if (filteredCharacters.length === 0) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64">
          <div className="text-gray-500 text-sm text-center">
            {query ? '未找到匹配的角色' : '暂无角色'}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto w-64">
        {/* 搜索提示 */}
        {query && (
          <div className="p-2 border-b border-gray-100">
            <div className="text-xs text-gray-500">
              搜索 "{query}" 找到 {filteredCharacters.length} 个结果
            </div>
          </div>
        )}

        {/* 角色列表 */}
        <div className="py-1">
          {filteredCharacters.map((character, index) => (
            <button
              key={character.id}
              className={`w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 ${
                index === selectedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
              onClick={() => selectItem(character)}
            >
              <div className="flex items-center gap-2">
                <div className="font-medium text-sm">{character.name}</div>
                {character.gender && (
                  <span className="text-xs text-gray-500">
                    {character.gender === '男' ? '♂️' : character.gender === '女' ? '♀️' : '⚲'}
                  </span>
                )}
              </div>
              {character.aliases && (
                <div className="text-xs text-gray-500 mt-0.5">
                  别名: {character.aliases}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }
);

CharacterSuggest.displayName = 'CharacterSuggest';