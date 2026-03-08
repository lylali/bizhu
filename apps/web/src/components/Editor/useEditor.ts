import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';

export function useEditorInstance(content = '', onChange?: (content: string) => void) {
  return useEditor({
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
}