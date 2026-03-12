import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Character, CharacterRelation } from '@shared';import { characterApi } from '@/api';import { characterApi } from '@/api';
import { useDebounce } from '@/hooks/useDebounce';

// 关系类型颜色映射
const RELATION_COLORS = {
  朋友: '#3B82F6', // 蓝色
  敌人: '#EF4444', // 红色
  师徒: '#F97316', // 橙色
  恋人: '#EC4899', // 粉色
  亲属: '#10B981', // 绿色
  其他: '#6B7280', // 灰色
} as const;

// 性别图标映射
const GENDER_ICONS = {
  男: '♂️',
  女: '♀️',
  未知: '⚲',
} as const;

// 自定义节点组件
const CharacterNode = ({ data }: { data: any }) => {
  const { character, onClick } = data;
  const firstTag = character.tags ? JSON.parse(character.tags)[0] : null;
  const genderIcon = GENDER_ICONS[character.gender as keyof typeof GENDER_ICONS] || GENDER_ICONS.未知;

  return (
    <div
      className="px-4 py-2 shadow-lg rounded-lg bg-white border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors min-w-[120px] text-center"
      onClick={() => onClick(character)}
    >
      <div className="font-semibold text-gray-900 text-sm">
        {character.name}
      </div>
      <div className="flex items-center justify-center gap-1 mt-1">
        <span className="text-xs">{genderIcon}</span>
        {firstTag && (
          <span className="text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-600">
            {firstTag}
          </span>
        )}
      </div>
    </div>
  );
};

const nodeTypes = {
  character: CharacterNode,
};

interface CharacterGraphProps {
  characters: Character[];
  relations: CharacterRelation[];
  workId: string;
  onNodeClick: (character: Character) => void;
  onAddRelation: () => void;
  onRefresh: () => void;
}

export const CharacterGraph: React.FC<CharacterGraphProps> = ({
  characters,
  relations,
  workId,
  onNodeClick,
  onAddRelation,
  onRefresh,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // 防抖保存位置
  const debouncedSavePosition = useDebounce(async (characterId: string, x: number, y: number) => {
    try {
      await characterApi.updatePosition(workId, characterId, { x, y });
    } catch (error) {
      console.error('Failed to save position:', error);
    }
  }, 1000);

  // 生成环形布局
  const generateCircularLayout = useCallback((chars: Character[]) => {
    const centerX = 400;
    const centerY = 300;
    const radius = Math.max(200, chars.length * 30); // 动态半径

    return chars.map((character, index) => {
      const angle = (index / chars.length) * 2 * Math.PI - Math.PI / 2; // 从顶部开始
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return {
        id: character.id,
        type: 'character',
        position: { x, y },
        data: {
          character,
          onClick: onNodeClick,
        },
      };
    });
  }, [onNodeClick]);

  // 初始化节点和边
  useEffect(() => {
    if (characters.length === 0) return;

    // 检查是否有角色没有位置信息
    const hasUnpositioned = characters.some(char => char.positionX === 0 && char.positionY === 0);

    let initialNodes: Node[];
    if (hasUnpositioned) {
      // 使用环形布局
      initialNodes = generateCircularLayout(characters);
      // 保存初始位置
      initialNodes.forEach(node => {
        const character = node.data.character;
        debouncedSavePosition(character.id, node.position.x, node.position.y);
      });
    } else {
      // 使用保存的位置
      initialNodes = characters.map(character => ({
        id: character.id,
        type: 'character',
        position: { x: character.positionX, y: character.positionY },
        data: {
          character,
          onClick: onNodeClick,
        },
      }));
    }

    setNodes(initialNodes);

    // 生成边
    const initialEdges: Edge[] = relations.map(relation => ({
      id: relation.id,
      source: relation.fromId,
      target: relation.toId,
      label: relation.relationType,
      style: {
        stroke: RELATION_COLORS[relation.relationType as keyof typeof RELATION_COLORS] || RELATION_COLORS.其他,
        strokeWidth: 2,
      },
      labelStyle: {
        fontSize: '12px',
        fontWeight: 'bold',
      },
      type: 'default',
    }));

    setEdges(initialEdges);
  }, [characters, relations, generateCircularLayout, onNodeClick, setNodes, setEdges, debouncedSavePosition]);

  // 处理节点拖拽结束
  const onNodeDragStop = useCallback((event: any, node: Node) => {
    const character = node.data.character;
    debouncedSavePosition(character.id, node.position.x, node.position.y);
  }, [debouncedSavePosition]);

  // 处理连接（暂时禁用，因为我们使用弹窗添加关系）
  const onConnect = useCallback((params: Connection) => {
    // 不允许直接连接，使用弹窗添加关系
  }, []);

  return (
    <div className="w-full h-[600px] border border-gray-200 rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <Background />
        <MiniMap />

        {/* 右上角面板 */}
        <Panel position="top-right">
          <button
            onClick={onAddRelation}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <span>+</span>
            添加关系
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};