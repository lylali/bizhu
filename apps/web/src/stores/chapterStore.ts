import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Chapter } from '@shared';

interface ChapterState {
  // 当前编辑的章节
  currentChapter: Chapter | null;
  setCurrentChapter: (chapter: Chapter | null) => void;

  // 保存状态
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;

  // 最后保存时间
  lastSavedAt: Date | null;
  setLastSavedAt: (date: Date | null) => void;

  // 未保存的变更标记
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;

  // 错误信息
  error: string | null;
  setError: (error: string | null) => void;

  // 清空状态
  reset: () => void;
}

const initialState = {
  currentChapter: null,
  isSaving: false,
  lastSavedAt: null,
  hasUnsavedChanges: false,
  error: null,
};

export const useChapterStore = create<ChapterState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setCurrentChapter: (chapter) => set({ currentChapter: chapter }),

        setIsSaving: (saving) => set({ isSaving: saving }),

        setLastSavedAt: (date) => set({ lastSavedAt: date }),

        setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),

        setError: (error) => set({ error }),

        reset: () => set(initialState),
      }),
      {
        name: 'chapter-store',
        partialize: (state) => ({
          currentChapter: state.currentChapter,
          lastSavedAt: state.lastSavedAt,
        }),
      }
    ),
    { name: 'ChapterStore' }
  )
);
