import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workApi } from '../../api/workApi';
import { Work } from '@shared';
import WorkCard from '../../components/Dashboard/WorkCard';

/**
 * Dashboard 页面 - 作品列表 + 统计看板
 */
export default function Dashboard(): JSX.Element {
  const navigate = useNavigate();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWorks();
  }, []);

  const loadWorks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await workApi.getWorks();
      setWorks(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载作品列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleWorkClick = (workId: string) => {
    // 跳转到编辑器，默认打开最近编辑的章节
    navigate(`/editor/${workId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️ {error}</div>
          <button
            onClick={loadWorks}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">我的作品</h1>
              <p className="text-gray-600 mt-1">管理您的创作，追踪写作进度</p>
            </div>
            <button
              onClick={() => navigate('/editor/new')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              ✏️ 新建作品
            </button>
          </div>
        </div>
      </div>

      {/* 作品网格 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {works.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">还没有作品</h3>
            <p className="text-gray-600 mb-6">开始您的创作之旅吧！</p>
            <button
              onClick={() => navigate('/editor/new')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              创建第一个作品
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {works.map((work) => (
              <WorkCard
                key={work.id}
                work={work}
                onClick={handleWorkClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
