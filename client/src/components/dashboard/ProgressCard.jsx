import React from 'react';
import { Card } from '../ui/Card';

export const ProgressCard = ({ title, percentage = 0, completed = 0, total = 0, color = 'bg-brand-500' }) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</span>
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500">{completed} of {total} habits completed</p>
    </Card>
  );
};
