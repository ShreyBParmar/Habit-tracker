import React, { useState, useEffect } from 'react';
import { Plus, CheckSquare, Flame, TrendingUp, Calendar as CalendarIcon, Award } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/dashboard/StatCard';
import { WeeklyChart } from '../components/dashboard/WeeklyChart';
import { ProgressCard } from '../components/dashboard/ProgressCard';
import { HabitList } from '../components/habits/HabitList';
import { HabitFormModal } from '../components/habits/HabitFormModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Toast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { dashboardService } from '../services/dashboardService';
import { habitService } from '../services/habitService';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Notifications state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deletingHabit, setDeletingHabit] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [sumRes, habRes] = await Promise.all([
        dashboardService.getSummary(),
        habitService.getHabits(),
      ]);

      if (sumRes.success) setSummary(sumRes.data);
      if (habRes.success) setHabits(habRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setToast({ type: 'error', message: 'Failed to load dashboard data' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleComplete = async (habit) => {
    try {
      if (habit.completedToday) {
        await habitService.undoCompletion(habit._id);
        setToast({ type: 'info', message: `Marked "${habit.name}" as incomplete` });
      } else {
        await habitService.completeHabit(habit._id);
        setToast({ type: 'success', message: `Completed "${habit.name}"!` });
      }
      fetchDashboardData();
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update habit status' });
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingHabit) {
        await habitService.updateHabit(editingHabit._id, formData);
        setToast({ type: 'success', message: 'Habit updated successfully' });
      } else {
        await habitService.createHabit(formData);
        setToast({ type: 'success', message: 'Habit created successfully!' });
      }
      setIsFormOpen(false);
      setEditingHabit(null);
      fetchDashboardData();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to save habit' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingHabit) return;
    try {
      await habitService.deleteHabit(deletingHabit._id);
      setToast({ type: 'success', message: 'Habit deleted' });
      setDeletingHabit(null);
      fetchDashboardData();
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete habit' });
    }
  };

  return (
    <AppLayout title={`Hello, ${user?.name?.split(' ')[0] || 'User'} 👋`}>
      <div className="space-y-8">
        {/* Header Action Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Daily Dashboard</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track your daily goals and keep your consistency streak alive.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingHabit(null);
              setIsFormOpen(true);
            }}
            variant="primary"
          >
            <Plus className="w-4 h-4" /> New Habit
          </Button>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Habits"
            value={summary?.totalHabits || 0}
            subtitle="Active tracking"
            icon={CheckSquare}
            color="brand"
          />
          <StatCard
            title="Completed Today"
            value={`${summary?.completedToday || 0} / ${summary?.totalHabits || 0}`}
            subtitle={`${summary?.pendingToday || 0} pending`}
            icon={Award}
            color="emerald"
          />
          <StatCard
            title="Current Streak"
            value={`${summary?.currentStreak || 0} Days`}
            subtitle={`Best: ${summary?.longestStreak || 0} days`}
            icon={Flame}
            color="amber"
          />
          <StatCard
            title="Completion Rate"
            value={`${summary?.completionPercentage || 0}%`}
            subtitle="30-day average"
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Charts & Today Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">Weekly Progress</h4>
              <span className="text-xs text-gray-400 font-medium">Last 7 Days</span>
            </div>
            <WeeklyChart data={summary?.weeklyProgress || []} />
          </div>

          <div className="space-y-4">
            <ProgressCard
              title="Today's Target"
              percentage={
                summary?.totalHabits > 0
                  ? Math.round((summary.completedToday / summary.totalHabits) * 100)
                  : 0
              }
              completed={summary?.completedToday || 0}
              total={summary?.totalHabits || 0}
              color="bg-emerald-500"
            />

            <div className="bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-2 text-brand-200 text-xs font-semibold uppercase tracking-wider">
                <Flame className="w-4 h-4 fill-brand-300" /> Consistency Tip
              </div>
              <p className="text-sm font-medium leading-relaxed">
                Consistency beats intensity. Completing 1 small habit every day builds long-term momentum!
              </p>
            </div>
          </div>
        </div>

        {/* Today's Habits List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Your Habits</h3>
          <HabitList
            habits={habits}
            isLoading={isLoading}
            onToggleComplete={handleToggleComplete}
            onEdit={(h) => {
              setEditingHabit(h);
              setIsFormOpen(true);
            }}
            onDelete={(h) => setDeletingHabit(h)}
            onCreateNew={() => {
              setEditingHabit(null);
              setIsFormOpen(true);
            }}
          />
        </div>
      </div>

      {/* Form Modal */}
      <HabitFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingHabit}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingHabit}
        onClose={() => setDeletingHabit(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Habit"
        message={`Are you sure you want to delete "${deletingHabit?.name}"? All completion history will be removed.`}
      />

      {/* Toast notification */}
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </AppLayout>
  );
};
