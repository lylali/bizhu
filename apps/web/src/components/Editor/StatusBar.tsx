import { Editor } from '@tiptap/react';
import { ConnectionStatus } from './useEditor';

interface StatusBarProps {
  editor: Editor;
  connectionStatus: ConnectionStatus;
}

export default function StatusBar({ editor, connectionStatus }: StatusBarProps) {
  // 计算字数：中文按字符算，英文按单词算
  const getWordCount = () => {
    const text = editor.getText();
    // 中文字符（包括标点）
    const chineseChars = text.match(/[\u4e00-\u9fa5]/g)?.length || 0;
    // 英文单词
    const englishWords = text.replace(/[\u4e00-\u9fa5]/g, '').match(/\b\w+\b/g)?.length || 0;
    return chineseChars + englishWords;
  };

  const wordCount = getWordCount();

  // 连接状态指示器
  const getStatusIndicator = () => {
    switch (connectionStatus) {
      case 'synced':
        return {
          icon: '🟢',
          text: '已同步',
          color: 'text-green-600',
        };
      case 'syncing':
        return {
          icon: '🟡',
          text: '同步中...',
          color: 'text-yellow-600',
        };
      case 'offline':
        return {
          icon: '🔴',
          text: '离线（本地编辑中）',
          color: 'text-red-600',
        };
    }
  };

  const statusIndicator = getStatusIndicator();

  return (
    <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600 flex justify-between items-center">
      <div>
        字数：{wordCount}
      </div>
      <div className={statusIndicator.color}>
        {statusIndicator.icon} {statusIndicator.text}
      </div>
    </div>
  );
}