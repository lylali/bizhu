import { Editor } from '@tiptap/react';

interface StatusBarProps {
  editor: Editor;
}

export default function StatusBar({ editor }: StatusBarProps) {
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

  return (
    <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600 flex justify-between items-center">
      <div>
        字数：{wordCount}
      </div>
      <div className="text-green-600">
        已保存
      </div>
    </div>
  );
}