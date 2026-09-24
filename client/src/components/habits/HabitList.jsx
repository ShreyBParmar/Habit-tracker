import React from 'react';
import { HabitCard } from './HabitCard';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';

export const HabitList = ({
  habits = [],
  isLoading = false,
  onToggleComplete,
  onEdit,
  onArchive,
  onDelete,
  onViewHistory,
  onCreateNew,
  emptyTitle,
  emptyDescription,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || 'No habits found'}
        description={emptyDescription || 'Create a new daily or weekly habit to start building your streak!'}
        actionLabel="Add Habit"
        onAction={onCreateNew}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {habits.map((habit) => (
        <HabitCard
          key={habit._id || habit.id}
          habit={habit}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onArchive={onArchive}
          onDelete={onDelete}
          onViewHistory={onViewHistory}
        />
      ))}
    </div>
  );
};
