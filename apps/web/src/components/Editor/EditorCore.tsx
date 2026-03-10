import { EditorContent } from '@tiptap/react';
import { useEffect } from 'react';
import Toolbar from './Toolbar';
import StatusBar from './StatusBar';
import OutlineTree from '../Outline/OutlineTree';
import ResizablePanel from '../Outline/ResizablePanel';
import { useEditorInstance, type ConnectionStatus } from './useEditor';

interface EditorCoreProps {
  workId?: string;
  chapterId: string;
  token: string;
  onChange?: (content: string) => void;
}

export function EditorCore({ workId, chapterId, token, onChange }: EditorCoreProps) {
  const { editor, connectionStatus, forceSave } = useEditorInstance({
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
      <div className="flex flex-1 overflow-hidden bg-white">
        {/* 左侧大纲面板（可拖拽调整宽度） */}
        {workId && (
          <ResizablePanel initialWidth={240} minWidth={160} maxWidth={400}>
            <OutlineTree workId={workId} />
          </ResizablePanel>
        )}

        {/* 右侧编辑器区域 */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto">
            <div className="max-w-[680px] mx-auto">
              <EditorContent editor={editor} data-testid="editor-content" />
            </div>
          </div>
          <StatusBar
            editor={editor}
            connectionStatus={connectionStatus}
            onRetry={forceSave}
          />
        </div>
      </div>
    </div>
  );
}