import React, { useState, useRef } from 'react';
import { ChevronDown, Edit2, Trash2, Plus } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useOutlineStore, type OutlineNode as OutlineNodeType } from '../../stores/outlineStore';
import { outlineApi } from '../../api/outlineApi';
import './Outline.css';

interface OutlineNodeProps {
  node: OutlineNodeType;
  depth: number;
}

export default function OutlineNode({ node, depth }: OutlineNodeProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const {
    expandedNodeIds,
    selectedNodeId,
    editingNodeId,
    workId,
    toggleNodeExpanded,
    setSelectedNodeId,
    setEditingNodeId,
    setRoots,
    setError,
  } = useOutlineStore();

  const [title, setTitle] = useState(node.title);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextPos, setContextPos] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const isExpanded = expandedNodeIds.has(node.id);
  const isSelected = selectedNodeId === node.id;
  const isEditing = editingNodeId === node.id;
  const hasChildren = node.children && node.children.length > 0;

  // 右键菜单
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  // 关闭右键菜单
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node)
      ) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContextMenu]);

  // 双击编辑
  const handleDoubleClick = () => {
    setEditingNodeId(node.id);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  // 保存编辑
  const handleSaveEdit = async () => {
    if (!workId || !title.trim()) {
      setEditingNodeId(null);
      setTitle(node.title);
      return;
    }

    try {
      await outlineApi.updateNode(workId, node.id, { title: title.trim() });
      setEditingNodeId(null);
      // 重新加载大纲树
      const response = await outlineApi.getTree(workId);
      setRoots(response.roots || []);
    } catch (err) {
      console.error('Failed to update node:', err);
      setError(err instanceof Error ? err.message : 'Failed to update node');
      setTitle(node.title);
      setEditingNodeId(null);
    }
  };

  // 删除节点
  const handleDelete = async () => {
    if (!workId || !window.confirm('确定删除这个大纲节点及其子节点吗？')) {
      setShowContextMenu(false);
      return;
    }

    try {
      await outlineApi.deleteNode(workId, node.id);
      // 重新加载大纲树
      const response = await outlineApi.getTree(workId);
      setRoots(response.roots || []);
      setShowContextMenu(false);
    } catch (err) {
      console.error('Failed to delete node:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete node');
      setShowContextMenu(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`outline-node ${isDragging ? 'dragging' : ''}`}
    >
      <div
        className={`outline-node-content ${isSelected ? 'selected' : ''}`}
        onContextMenu={handleContextMenu}
        onClick={() => setSelectedNodeId(node.id)}
        {...attributes}
        {...listeners}
      >
        {/* 展开/折叠按钮 */}
        {hasChildren && (
          <button
            className={`outline-expand-btn ${isExpanded ? 'expanded' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleNodeExpanded(node.id);
            }}
          >
            <ChevronDown size={16} />
          </button>
        )}

        {!hasChildren && <div className="outline-expand-placeholder" />}

        {/* 节点标题 */}
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSaveEdit();
              } else if (e.key === 'Escape') {
                setEditingNodeId(null);
                setTitle(node.title);
              }
            }}
            className="outline-node-edit"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className="outline-node-title"
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleDoubleClick();
            }}
          >
            {node.title}
          </span>
        )}

        {/* 章节关联显示 */}
        {node.chapterId && (
          <span className="outline-node-chapter" title="Linked to chapter">
            📖
          </span>
        )}
      </div>

      {/* 右键菜单 */}
      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className="outline-context-menu"
          style={{ top: contextPos.y, left: contextPos.x }}
        >
          <button onClick={() => setEditingNodeId(node.id)}>
            <Edit2 size={14} /> 编辑
          </button>
          <button
            onClick={() => {
              setEditingNodeId('new-' + node.id);
              setShowContextMenu(false);
            }}
          >
            <Plus size={14} /> 新建子节点
          </button>
          <button onClick={handleDelete} className="danger">
            <Trash2 size={14} /> 删除
          </button>
        </div>
      )}

      {/* 子节点 */}
      {hasChildren && isExpanded && (
        <div className="outline-children">
          {node.children!.map((child) => (
            <OutlineNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
