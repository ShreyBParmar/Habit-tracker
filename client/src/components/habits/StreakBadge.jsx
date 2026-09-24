import React from 'react';
import { Flame } from 'lucide-react';

export const StreakBadge = ({ count = 0, size = 'md' }) => {
  if (count === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
        <Flame className="w-3.5 h-3.5 opacity-50" /> 0 day streak
      </span>
    );
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  };

  return (
    <span className={`inline-flex items-center font-semibold rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40 ${sizes[size]}`}>
      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
      {count} {count === 1 ? 'day' : 'days'}
    </span>
  );
};
