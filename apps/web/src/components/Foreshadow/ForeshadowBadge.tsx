import React from 'react';

interface ForeshadowBadgeProps {
  count: number;
  className?: string;
}

export const ForeshadowBadge: React.FC<ForeshadowBadgeProps> = ({
  count,
  className = ''
}) => {
  if (count === 0) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded-full ${className}`}
      title={`${count}个伏笔`}
    >
      {count}
    </span>
  );
};