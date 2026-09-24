import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { ActivityCalendar } from '../components/dashboard/ActivityCalendar';
import { Select } from '../components/ui/Select';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { StreakBadge } from '../components/habits/StreakBadge';
import { Badge } from '../components/ui/Badge';
import { Toast } from '../components/ui/Toast';
import { habitService } from '../services/habitService';

export const CalendarPage = () => {
  const [habits, setHabits] = useState([]);
  const [selectedHabitId, setSelectedHabitId] = useState('');
  const [historyData, setHistoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        setIsLoading(true);
        const res = await habitService.getHabits({ archived: 'false' });
        if (res.success && res.data.length > 0) {
          setHabits(res.data);
          setSelectedHabitId(res.data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching habits:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHabits();
  }, []);

  useEffect(() => {
    if (!selectedHabitId) return;

    const fetchHistory = async () => {
      try {
        setIsHistoryLoading(true);
        const res = await habitService.getHabitHistory(selectedHabitId);
        if (res.success) {
          setHistoryData(res.data);
        }
      } catch (err) {
        console.error('Error fetching habit history:', err);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [selectedHabitId]);

  const handleToggleDate = async (habit, dateStr, currentlyCompleted) => {
    try {
      if (currentlyCompleted) {
        await habitService.undoCompletion(habit._id, dateStr);
        setToast({ type: 'info', message: `Removed completion for ${dateStr}` });
      } else {
        await habitService.completeHabit(habit._id, dateStr);
        setToast({ type: 'success', message: `Marked completed for ${dateStr}` });
      }
      const res = await habitService.getHabitHistory(habit._id);
      if (res.success) setHistoryData(res.data);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update date status' });
    }
  };

  const selectedHabit = habits.find((h) => h._id === selectedHabitId);

  return (
    <AppLayout title="Habit Calendar & History">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Select Habit to View
            </label>
            <Select
              value={selectedHabitId}
              onChange={(e) => setSelectedHabitId(e.target.value)}
              disabled={isLoading || habits.length === 0}
            >
              {habits.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name} ({h.type === 'weekly' ? 'Weekly' : 'Daily'})
                </option>
              ))}
            </Select>
          </div>

          {selectedHabit && (
            <div className="flex items-center gap-3 pt-2 sm:pt-6">
              <Badge variant={selectedHabit.type === 'weekly' ? 'purple' : 'brand'}>
                {selectedHabit.type === 'weekly' ? 'Weekly' : 'Daily'}
              </Badge>
              <StreakBadge count={historyData?.currentStreak || selectedHabit.currentStreak || 0} />
            </div>
          )}
        </div>

        {isLoading || isHistoryLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : habits.length === 0 ? (
          <EmptyState title="No active habits" description="Create a habit first to see your completion history." />
        ) : historyData ? (
          <ActivityCalendar
            habit={historyData.habit}
            completions={historyData.completions}
            onToggleDate={handleToggleDate}
          />
        ) : null}
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </AppLayout>
  );
};
