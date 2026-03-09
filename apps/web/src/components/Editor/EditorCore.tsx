import { EditorContent } from '@tiptap/react';
import { useEffect } from 'react';
import Toolbar from './Toolbar';
import StatusBar from './StatusBar';
import { useEditorInstance, type ConnectionStatus } from './useEditor';

interface EditorCoreProps {
  chapterId: string;
  token: string;
  onChange?: (content: string) => void;
}

export function EditorCore({ chapterId, token, onChange }: EditorCoreProps) {
  const { editor, connectionStatus } = useEditorInstance({
    chapterId,
    token,
    onChange,
  });

  useEffect(() => {
    if (editor && !editor.isFocused) {
      editor.commands.focus();
    }
  }, [editor]);

  if (!editor) {
    return <div className="flex items-center justify-center h-screen">加载中...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <Toolbar editor={editor} />
      <div className="flex-1 overflow-auto">
        <div className="max-w-[680px] mx-auto">
          <EditorContent editor={editor} data-testid="editor-content" />
        </div>
      </div>
      <StatusBar editor={editor} connectionStatus={connectionStatus} />
    </div>
  );
}