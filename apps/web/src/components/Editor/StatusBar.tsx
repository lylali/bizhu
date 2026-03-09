import { Editor } from '@tiptap/react';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import { ConnectionStatus } from './useEditor';
import { useChapterStore, type SavingStatus } from '../../stores/chapterStore';

dayjs.extend(relativeTimePlugin);
dayjs.locale('zh-cn');

interface StatusBarProps {
  editor: Editor;
  connectionStatus: ConnectionStatus;
  onRetry?: () => void;
}

export default function StatusBar({ editor, connectionStatus, onRetry }: StatusBarProps) {
  const [timeAgo, setTimeAgo] = useState<string>('');
  const { savingStatus, lastSavedAt, saveError } = useChapterStore();

  // 更新相对时间
  useEffect(() => {
    if (!lastSavedAt) return;

    const updateRelativeTime = () => {
      setTimeAgo(dayjs(lastSavedAt).fromNow());
    };

    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 60000); // 每分钟更新

    return () => clearInterval(interval);
  }, [lastSavedAt]);

  // 计算字数：中文按字符算，英文按单词算
  const getWordCount = () => {
    const text = editor.getText();
    const chineseChars = text.match(/[\u4e00-\u9fa5]/g)?.length || 0;
    const englishWords = text
      .replace(/[\u4e00-\u9fa5]/g, '')
      .match(/\b\w+\b/g)?.length || 0;
    return chineseChars + englishWords;
  };

  const wordCount = getWordCount();

  // 保存状态指示器
  const getSaveStatusIndicator = () => {
    switch (savingStatus) {
      case 'idle':
        return {
          icon: '💾',
          text: lastSavedAt ? `已保存 · ${timeAgo}` : '已保存',
          color: 'text-green-600',
          interactive: false,
        };
      case 'saving':
        return {
          icon: '⏳',
          text: '同步中...',
          color: 'text-blue-600',
          interactive: false,
        };
      case 'offline':
        return {
          icon: '📱',
          text: '离线 · 本地已保存',
          color: 'text-orange-600',
          interactive: false,
        };
      case 'error':
        return {
          icon: '⚠️',
          text: '保存失败 · 点击重试',
          color: 'text-red-600',
          interactive: true,
        };
      default:
        return {
          icon: '💾',
          text: '已保存',
          color: 'text-gray-600',
          interactive: false,
        };
    }
  };

  const statusIndicator = getSaveStatusIndicator();

  return (
    <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600 flex justify-between items-center">
      <div>字数：{wordCount}</div>
      <div
        className={`flex items-center gap-1 ${statusIndicator.color} ${
          statusIndicator.interactive ? 'cursor-pointer hover:underline' : ''
        }`}
        onClick={() => {
          if (statusIndicator.interactive && onRetry) {
            onRetry();
          }
        }}
        title={
          savingStatus === 'error'
            ? saveError || '保存失败'
            : undefined
        }
      >
        <span>{statusIndicator.icon}</span>
        <span>{statusIndicator.text}</span>
      </div>
    </div>
  );
}