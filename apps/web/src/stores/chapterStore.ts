import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Chapter } from '@shared';

export type SavingStatus = 'idle' | 'saving' | 'offline' | 'error';

interface ChapterState {
  // 当前编辑的章节
  currentChapter: Chapter | null;
  setCurrentChapter: (chapter: Chapter | null) => void;

  // 保存状态：idle（已保存）| saving（同步中）| offline（离线）| error（保存失败）
  savingStatus: SavingStatus;
  setSavingStatus: (status: SavingStatus) => void;

  // 最后保存时间
  lastSavedAt: Date | null;
  setLastSavedAt: (date: Date | null) => void;

  // 保存错误信息
  saveError: string | null;
  setSaveError: (error: string | null) => void;

  // 清空状态
  reset: () => void;
}

const initialState = {
  currentChapter: null,
  savingStatus: 'idle' as SavingStatus,
  lastSavedAt: null,
  saveError: null,
};

export const useChapterStore = create<ChapterState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setCurrentChapter: (chapter) => set({ currentChapter: chapter }),

        setSavingStatus: (status) => set({ savingStatus: status }),

        setLastSavedAt: (date) => set({ lastSavedAt: date }),

        setSaveError: (error) => set({ saveError: error }),

        reset: () => set(initialState),
      }),
      {
        name: 'chapter-store',
        partialize: (state) => ({
          currentChapter: state.currentChapter,
          lastSavedAt: state.lastSavedAt,
          savingStatus: state.savingStatus,
        }),
      }
    ),
    { name: 'ChapterStore' }
  )
);
