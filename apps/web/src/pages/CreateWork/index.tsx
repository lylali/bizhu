import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workApi } from '../../api/workApi';
import { CreateWorkRequest } from '@shared';

export default function CreateWork(): JSX.Element {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateWorkRequest>({
    title: '',
    description: '',
    type: '长篇',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const workTypes = [
    { value: '长篇', label: '长篇小说' },
    { value: '短篇', label: '短篇小说' },
    { value: '剧本', label: '剧本' },
    { value: '短剧', label: '短剧' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('作品标题不能为空');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await workApi.createWork(formData);
      const workId = response.data.id;

      // 创建成功后跳转到编辑器
      navigate(`/editor/${workId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建作品失败');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateWorkRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            创建新作品
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            开始您的创作之旅
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="title" className="sr-only">
                作品标题
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="作品标题"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="type" className="sr-only">
                作品类型
              </label>
              <select
                id="type"
                name="type"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
              >
                {workTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="sr-only">
                作品简介
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="作品简介（可选）"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '创建中...' : '创建作品'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              返回作品列表
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}