import React, { useState, useEffect } from 'react';
import { Foreshadow } from '@shared';
import { useForeshadow } from './useForeshadow';
import { ForeshadowForm } from './ForeshadowForm';

interface ForeshadowListProps {
  workId: string;
}

export const ForeshadowList: React.FC<ForeshadowListProps> = ({ workId }) => {
  const {
    foreshadows,
    isLoading,
    isSaving,
    error,
    loadForeshadows,
    createForeshadow,
    updateForeshadow,
    markResolved,
    deleteForeshadow,
  } = useForeshadow({ workId });

  const [activeTab, setActiveTab] = useState<'unresolved' | 'resolved'>('unresolved');
  const [showForm, setShowForm] = useState(false);
  const [editingForeshadow, setEditingForeshadow] = useState<Foreshadow | undefined>();

  useEffect(() => {
    loadForeshadows();
  }, [loadForeshadows]);

  const filteredForeshadows = foreshadows.filter(f =>
    activeTab === 'resolved' ? f.isResolved : !f.isResolved
  );

  const handleCreate = async (data: any) => {
    const result = await createForeshadow(data);
    if (result.success) {
      setShowForm(false);
    }
    return result;
  };

  const handleUpdate = async (data: any) => {
    if (!editingForeshadow) return { success: false, error: '未找到编辑的伏笔' };

    const result = await updateForeshadow(editingForeshadow.id, data);
    if (result.success) {
      setEditingForeshadow(undefined);
      setShowForm(false);
    }
    return result;
  };

  const handleMarkResolved = async (foreshadowId: string, isResolved: boolean) => {
    await markResolved(foreshadowId, isResolved);
  };

  const handleDelete = async (foreshadowId: string) => {
    if (window.confirm('确定要删除这个伏笔吗？')) {
      await deleteForeshadow(foreshadowId);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '中';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 头部操作区 */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('unresolved')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'unresolved'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            未回收 ({foreshadows.filter(f => !f.isResolved).length})
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'resolved'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            已回收 ({foreshadows.filter(f => f.isResolved).length})
          </button>
        </div>

        <button
          onClick={() => {
            setEditingForeshadow(undefined);
            setShowForm(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          添加伏笔
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* 表单 */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingForeshadow ? '编辑伏笔' : '添加伏笔'}
          </h3>
          <ForeshadowForm
            foreshadow={editingForeshadow}
            workId={workId}
            onSubmit={editingForeshadow ? handleUpdate : handleCreate}
            isSaving={isSaving}
            onCancel={() => {
              setShowForm(false);
              setEditingForeshadow(undefined);
            }}
          />
        </div>
      )}

      {/* 伏笔列表 */}
      <div className="space-y-4">
        {filteredForeshadows.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {activeTab === 'unresolved' ? '暂无未回收的伏笔' : '暂无已回收的伏笔'}
          </div>
        ) : (
          filteredForeshadows.map((foreshadow) => (
            <div key={foreshadow.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">
                      {foreshadow.description}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(foreshadow.priority || 'medium')}`}>
                      {getPriorityText(foreshadow.priority || 'medium')}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <div>
                      埋设于第{foreshadow.plantedChapter?.order}章 - {foreshadow.plantedChapter?.title}
                    </div>
                    {foreshadow.expectedResolveChapter && (
                      <div>
                        预计第{foreshadow.expectedResolveChapter.order}章回收 - {foreshadow.expectedResolveChapter.title}
                      </div>
                    )}
                    {foreshadow.notes && (
                      <div className="text-gray-500 mt-2">
                        {foreshadow.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {activeTab === 'unresolved' && (
                    <button
                      onClick={() => handleMarkResolved(foreshadow.id, true)}
                      className="px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                    >
                      标记回收
                    </button>
                  )}
                  {activeTab === 'resolved' && (
                    <button
                      onClick={() => handleMarkResolved(foreshadow.id, false)}
                      className="px-3 py-1 text-sm text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded"
                    >
                      取消回收
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setEditingForeshadow(foreshadow);
                      setShowForm(true);
                    }}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                  >
                    编辑
                  </button>

                  <button
                    onClick={() => handleDelete(foreshadow.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};