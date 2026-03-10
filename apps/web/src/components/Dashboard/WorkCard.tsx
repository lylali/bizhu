import React from 'react';
import { Work } from '@shared';

interface WorkCardProps {
  work: Work;
  onClick: (workId: string) => void;
}

export default function WorkCard({ work, onClick }: WorkCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'publishing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return '草稿';
      case 'publishing':
        return '连载中';
      case 'completed':
        return '已完结';
      default:
        return status;
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
      onClick={() => onClick(work.id)}
    >
      {/* 封面区域 */}
      <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-lg flex items-center justify-center">
        {work.coverId ? (
          <img
            src={work.coverId}
            alt={work.title}
            className="w-full h-full object-cover rounded-t-lg"
          />
        ) : (
          <div className="text-white text-2xl font-bold">
            {work.title.charAt(0)}
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-2">
            {work.title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
            {getStatusText(work.status)}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {work.description || '暂无简介'}
        </p>

        <div className="text-xs text-gray-500 mb-2">
          {work.type} · {work.chapterCount}章
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-50 rounded p-2">
            <div className="text-lg font-bold text-gray-900">
              {work.totalWordCount.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">总字数</div>
          </div>

          <div className="bg-green-50 rounded p-2">
            <div className="text-lg font-bold text-green-600">
              +{work.todayWordCount.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">今日</div>
          </div>

          <div className="bg-orange-50 rounded p-2">
            <div className="text-lg font-bold text-orange-600">
              {work.streak}
            </div>
            <div className="text-xs text-gray-600">连更天</div>
          </div>
        </div>
      </div>
    </div>
  );
}