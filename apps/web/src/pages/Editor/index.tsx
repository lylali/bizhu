import { useParams } from 'react-router-dom';
import EditorCore from '../../components/Editor';

/**
 * Editor 页面 - 主编辑器
 * 集成 Tiptap 编辑器、大纲树、实时同步等功能
 */

export default function Editor(): JSX.Element {
  const { workId } = useParams<{ workId: string }>();

  const handleContentChange = (content: string) => {
    console.log('Content changed:', content);
    // TODO: 保存到后端
  };

  return (
    <div className="h-screen">
      <EditorCore
        content={`<h1>作品 ${workId} - 第一章</h1><p>开始你的创作吧...</p>`}
        onChange={handleContentChange}
      />
    </div>
  );
}
