import { useEffect, useState, useRef } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export type ConnectionStatus = 'synced' | 'syncing' | 'offline';

interface UseEditorOptions {
  chapterId: string;
  token: string;
  onChange?: (content: string) => void;
}

export function useEditorInstance({
  chapterId,
  token,
  onChange,
}: UseEditorOptions) {
  const [ydoc] = useState(() => new Y.Doc());
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('offline');
  const [isMounted, setIsMounted] = useState(false);
  const wsProvider = useRef<WebsocketProvider | null>(null);

  // 初始化 WebSocket 提供商
  useEffect(() => {
    if (!isMounted || !chapterId) return;

    try {
      // 从 localStorage 恢复之前保存的内容（离线支持）
      const cachedContent = localStorage.getItem(`chapter-content-${chapterId}`);
      if (cachedContent) {
        const ytext = ydoc.getText('content');
        ytext.insert(0, cachedContent);
      }

      // 连接到后端 WebSocket 服务
      const wsUrl = new URL(
        import.meta.env.VITE_WS_URL || 'ws://localhost:3001'
      );
      wsUrl.searchParams.append('token', token);
      wsUrl.searchParams.append('chapterId', chapterId);

      wsProvider.current = new WebsocketProvider(
        wsUrl.toString(),
        `chapter:${chapterId}`,
        ydoc,
        {
          connect: true,
          awareness: true,
          resyncInterval: 5000,
        }
      );

      // 监听连接状态变化
      const updateStatus = () => {
        if (!wsProvider.current) return;

        if (wsProvider.current.shouldConnect) {
          if (wsProvider.current.ws && wsProvider.current.ws.readyState === WebSocket.OPEN) {
            setConnectionStatus('synced');
          } else {
            setConnectionStatus('syncing');
          }
        } else {
          setConnectionStatus('offline');
        }
      };

      wsProvider.current.on('status', updateStatus);
      wsProvider.current.on('sync', updateStatus);

      // 初始状态检查
      updateStatus();

      // 监听本地内容变化，保存到 localStorage 用于离线支持
      const handleChange = () => {
        const content = ydoc.getText('content').toString();
        localStorage.setItem(`chapter-content-${chapterId}`, content);
        onChange?.(content);
      };
      ydoc.getText('content').observe(handleChange);

      return () => {
        ydoc.getText('content').unobserve(handleChange);
      };
    } catch (error) {
      console.error('Failed to initialize Yjs WebSocket provider:', error);
    }
  }, [ydoc, chapterId, token, isMounted, onChange]);

  // 在组件挂载时标记为已挂载
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount,
      // Collaboration extension 用来同步编辑
      Collaboration.configure({
        document: ydoc,
        field: 'content',
      }),
      // 显示其他用户的光标位置
      CollaborationCursor.configure({
        provider: wsProvider.current,
        user: {
          name: 'Anonymous User',
          color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        },
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      // Yjs 已经处理了内容同步，这里只用于本地 onChange 回调
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
      handleDOMEvents: {
        compositionstart: () => {
          return false;
        },
        compositionend: (view, event) => {
          const { state } = view;
          const { tr } = state;
          tr.setMeta('compositionEnd', true);
          view.dispatch(tr);
          return false;
        },
      },
    },
  });

  // 清理资源
  useEffect(() => {
    return () => {
      if (wsProvider.current) {
        wsProvider.current.destroy();
      }
      // 不销毁 ydoc，因为它可能被其他组件使用
    };
  }, []);

  // 处理多个 Tab 同步
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `chapter-content-${chapterId}` && e.newValue) {
        // 其他 Tab 也在编辑这个章节，通过 Yjs 共享文档自动同步
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [chapterId]);

  return {
    editor,
    connectionStatus,
    ydoc,
  };
}
