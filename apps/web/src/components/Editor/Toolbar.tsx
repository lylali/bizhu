import { Editor } from '@tiptap/react';
import { EditorContent } from '@tiptap/react';

interface ToolbarProps {
  editor: Editor;
}

export default function Toolbar({ editor }: ToolbarProps) {
  return (
    <div className="border-b border-gray-200 bg-white p-2 flex gap-1 flex-wrap">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1 rounded border ${
          editor.isActive('bold') ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
        }`}
      >
        <strong>B</strong>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1 rounded border ${
          editor.isActive('italic') ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
        }`}
      >
        <em>I</em>
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-3 py-1 rounded border ${
          editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
        }`}
      >
        H1
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-1 rounded border ${
          editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
        }`}
      >
        H2
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-3 py-1 rounded border ${
          editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
        }`}
      >
        H3
      </button>

      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`px-3 py-1 rounded border ${
          editor.isActive('paragraph') ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
        }`}
      >
        ¶
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="px-3 py-1 rounded border border-gray-300"
      >
        ―
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
      >
        ↶
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
      >
        ↷
      </button>
    </div>
  );
}