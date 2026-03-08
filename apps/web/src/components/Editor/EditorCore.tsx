import { useEditor, Editor } from '@tiptap/react';
import { EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import { useEffect } from 'react';
import Toolbar from './Toolbar';
import StatusBar from './StatusBar';

interface EditorCoreProps {
  content?: string;
  onChange?: (content: string) => void;
}

export function EditorCore({ content = '', onChange }: EditorCoreProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
      handleDOMEvents: {
        compositionstart: () => {
          // 中文输入法开始，不触发更新
          return false;
        },
        compositionend: (view, event) => {
          // 中文输入法结束，手动触发更新
          const { state } = view;
          const { tr } = state;
          tr.setMeta('compositionEnd', true);
          view.dispatch(tr);
          return false;
        },
      },
    },
  });

  useEffect(() => {
    if (editor && !editor.isFocused) {
      editor.commands.focus();
    }
  }, [editor]);

  if (!editor) {
    return <div>加载中...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <Toolbar editor={editor} />
      <div className="flex-1 overflow-auto">
        <div className="max-w-[680px] mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>
      <StatusBar editor={editor} />
    </div>
  );
}