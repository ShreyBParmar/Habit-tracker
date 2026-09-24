import React, { useState } from 'react';
import { Check, Target } from 'lucide-react';
import { HabitMenu } from './HabitMenu';
import { StreakBadge } from './StreakBadge';
import { Badge } from '../ui/Badge';

export const HabitCard = ({
  habit,
  onToggleComplete,
  onEdit,
  onArchive,
  onDelete,
  onViewHistory,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (e) => {
    e.stopPropagation();
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await onToggleComplete(habit);
    } finally {
      setIsUpdating(false);
    }
  };

  const selectedDaysList = habit.selectedDays && habit.selectedDays.length > 0
    ? habit.selectedDays
    : (typeof habit.days === 'string' ? habit.days.split(',').map(d => d.trim()).filter(Boolean) : []);

  return (
    <div
      className={`group relative bg-white dark:bg-gray-900 border rounded-2xl p-5 transition-all duration-200 hover:shadow-md ${
        habit.completedToday
          ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10'
          : 'border-gray-100 dark:border-gray-800'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ backgroundColor: `${habit.color || '#3B82F6'}20`, color: habit.color || '#3B82F6' }}
          >
            <Target className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4
                className={`text-base font-semibold truncate ${
                  habit.completedToday
                    ? 'text-gray-500 dark:text-gray-400 line-through'
                    : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                {habit.name}
              </h4>
              <Badge variant={habit.type === 'weekly' ? 'purple' : 'brand'}>
                {habit.type === 'weekly' ? 'Weekly' : 'Daily'}
              </Badge>
            </div>

            {habit.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">
                {habit.description}
              </p>
            )}

            {habit.type === 'weekly' && selectedDaysList.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap mt-1 mb-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                  const isSelected = selectedDaysList.some(d => d.trim().toLowerCase() === day.toLowerCase());
                  return (
                    <span
                      key={day}
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        isSelected
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                      }`}
                    >
                      {day.substring(0, 3)}
                    </span>
                  );
                })}
              </div>
            )}

            <div className="flex items-center gap-3 mt-2">
              <StreakBadge count={habit.currentStreak || 0} size="sm" />
              {habit.completionRate !== undefined && (
                <span className="text-xs text-gray-400">{habit.completionRate}% 30-day rate</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggle}
            disabled={isUpdating}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              habit.completedToday
                ? 'bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 focus:ring-emerald-500'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-brand-500'
            }`}
            title={habit.completedToday ? 'Mark incomplete' : 'Mark complete'}
          >
            {isUpdating ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check className="w-5 h-5" />
            )}
          </button>

          <HabitMenu
            onEdit={onEdit ? () => onEdit(habit) : undefined}
            onArchive={onArchive ? () => onArchive(habit) : undefined}
            onDelete={onDelete ? () => onDelete(habit) : undefined}
            onViewHistory={onViewHistory ? () => onViewHistory(habit) : undefined}
            isArchived={habit.isArchived}
          />
        </div>
      </div>
    </div>
  );
};
