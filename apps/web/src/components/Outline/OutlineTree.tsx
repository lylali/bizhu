import React, { useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useOutlineStore } from '../../stores/outlineStore';
import { outlineApi } from '../../api/outlineApi';
import OutlineNodeComponent from './OutlineNode';
import './Outline.css';

interface OutlineTreeProps {
  workId: string;
}

export default function OutlineTree({ workId }: OutlineTreeProps) {
  const { roots, isLoading, error, setWorkId, setRoots, setIsLoading, setError } =
    useOutlineStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 处理拖拽结束
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = roots.findIndex((item) => item.id === active.id);
      const newIndex = roots.findIndex((item) => item.id === over.id);

      const newRoots = arrayMove(roots, oldIndex, newIndex);

      // 乐观更新UI
      setRoots(newRoots);

      try {
        // 调用API更新顺序
        await outlineApi.reorderNodes(workId, {
          nodeIds: newRoots.map(node => node.id),
        });
      } catch (err) {
        console.error('Failed to reorder nodes:', err);
        setError('Failed to reorder nodes');
        // 失败时恢复原始顺序
        setRoots(roots);
      }
    }
  };

  // 加载大纲树
  useEffect(() => {
    const loadOutline = async () => {
      if (!workId) return;

      setWorkId(workId);
      setIsLoading(true);
      setError(null);

      try {
        const response = await outlineApi.getTree(workId);
        setRoots(response.roots || []);
      } catch (err) {
        console.error('Failed to load outline:', err);
        setError(err instanceof Error ? err.message : 'Failed to load outline');
      } finally {
        setIsLoading(false);
      }
    };

    loadOutline();
  }, [workId, setWorkId, setRoots, setIsLoading, setError]);

  return (
    <div className="outline-tree">
      <div className="outline-header">
        <h3>大纲</h3>
        <button className="outline-add-btn" title="Add root node">
          +
        </button>
      </div>

      {isLoading && <div className="outline-loading">加载中...</div>}

      {error && <div className="outline-error">{error}</div>}

      {!isLoading && roots.length === 0 && (
        <div className="outline-empty">暂无大纲，点击 + 新建</div>
      )}

      {!isLoading && roots.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={roots.map((node) => node.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="outline-nodes">
              {roots.map((node) => (
                <OutlineNodeComponent key={node.id} node={node} depth={0} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
