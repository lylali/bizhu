import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface OutlineNode {
  id: string;
  title: string;
  content?: string;
  order: number;
  parentId?: string | null;
  chapterId?: string | null;
  children?: OutlineNode[];
  createdAt: Date;
  updatedAt: Date;
}

interface OutlineState {
  // 当前工作的作品ID
  workId: string | null;
  setWorkId: (workId: string | null) => void;

  // 大纲树根节点
  roots: OutlineNode[];
  setRoots: (roots: OutlineNode[]) => void;

  // 展开/折叠状态
  expandedNodeIds: Set<string>;
  toggleNodeExpanded: (nodeId: string) => void;

  // 选中节点
  selectedNodeId: string | null;
  setSelectedNodeId: (nodeId: string | null) => void;

  // 编辑中的节点（右键菜单新建或双击编辑）
  editingNodeId: string | null;
  setEditingNodeId: (nodeId: string | null) => void;

  // 加载状态
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // 错误信息
  error: string | null;
  setError: (error: string | null) => void;

  // 重置状态
  reset: () => void;
}

const initialState: OutlineState = {
  workId: null,
  roots: [],
  expandedNodeIds: new Set<string>(),
  selectedNodeId: null,
  editingNodeId: null,
  isLoading: false,
  error: null,
  setWorkId: () => {},
  setRoots: () => {},
  toggleNodeExpanded: () => {},
  setSelectedNodeId: () => {},
  setEditingNodeId: () => {},
  setIsLoading: () => {},
  setError: () => {},
  reset: () => {},
};

export const useOutlineStore = create<OutlineState>()(
  devtools(
    (set) => ({
      workId: null,
      roots: [],
      expandedNodeIds: new Set<string>(),
      selectedNodeId: null,
      editingNodeId: null,
      isLoading: false,
      error: null,

      setWorkId: (workId) => set({ workId }),

      setRoots: (roots) => set({ roots }),

      toggleNodeExpanded: (nodeId) =>
        set((state) => {
          const newSet = new Set(state.expandedNodeIds);
          if (newSet.has(nodeId)) {
            newSet.delete(nodeId);
          } else {
            newSet.add(nodeId);
          }
          return { expandedNodeIds: newSet };
        }),

      setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),

      setEditingNodeId: (nodeId) => set({ editingNodeId: nodeId }),

      setIsLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      reset: () => set(initialState),
    }),
    { name: 'OutlineStore' }
  )
);
