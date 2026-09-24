import React from 'react';
import { Target } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = Target,
  title = 'No habits yet',
  description = 'Start tracking your daily or weekly routines by creating your first habit.',
  actionLabel = 'Create Habit',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
      <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">{description}</p>
      {onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
