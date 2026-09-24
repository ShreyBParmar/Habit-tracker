import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { HabitList } from '../components/habits/HabitList';
import { HabitFormModal } from '../components/habits/HabitFormModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Toast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { habitService } from '../services/habitService';

export const HabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('active'); // active, daily, weekly, archived
  const [search, setSearch] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deletingHabit, setDeletingHabit] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchHabits = async () => {
    try {
      setIsLoading(true);
      const isArchivedQuery = filter === 'archived' ? 'true' : filter === 'all' ? 'all' : 'false';
      const res = await habitService.getHabits({ archived: isArchivedQuery });
      if (res.success) {
        setHabits(res.data);
      }
    } catch (err) {
      console.error('Error fetching habits:', err);
      setToast({ type: 'error', message: 'Failed to load habits' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [filter]);

  const handleToggleComplete = async (habit) => {
    try {
      if (habit.completedToday) {
        await habitService.undoCompletion(habit._id);
        setToast({ type: 'info', message: `Marked "${habit.name}" as incomplete` });
      } else {
        await habitService.completeHabit(habit._id);
        setToast({ type: 'success', message: `Completed "${habit.name}"!` });
      }
      fetchHabits();
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
      fetchHabits();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to save habit' });
    }
  };

  const handleArchive = async (habit) => {
    try {
      await habitService.deleteHabit(habit._id, true);
      setToast({ type: 'success', message: `Archived "${habit.name}"` });
      fetchHabits();
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to archive habit' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingHabit) return;
    try {
      await habitService.deleteHabit(deletingHabit._id);
      setToast({ type: 'success', message: 'Habit deleted' });
      setDeletingHabit(null);
      fetchHabits();
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete habit' });
    }
  };

  const filteredHabits = habits.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'daily') return matchesSearch && h.type === 'daily';
    if (filter === 'weekly') return matchesSearch && h.type === 'weekly';
    return matchesSearch;
  });

  return (
    <AppLayout title="Habit Management">
      <div className="space-y-6">
        {/* Top Action & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Search habits..."
              icon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button
            onClick={() => {
              setEditingHabit(null);
              setIsFormOpen(true);
            }}
            variant="primary"
          >
            <Plus className="w-4 h-4" /> Add Habit
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-100 dark:border-gray-800">
          {[
            { id: 'active', label: 'All Active' },
            { id: 'daily', label: 'Daily Habits' },
            { id: 'weekly', label: 'Weekly Habits' },
            { id: 'archived', label: 'Archived' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                filter === tab.id
                  ? 'bg-brand-600 text-white shadow-sm dark:bg-brand-500'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Habit List Grid */}
        <HabitList
          habits={filteredHabits}
          isLoading={isLoading}
          onToggleComplete={handleToggleComplete}
          onEdit={(h) => {
            setEditingHabit(h);
            setIsFormOpen(true);
          }}
          onArchive={handleArchive}
          onDelete={(h) => setDeletingHabit(h)}
          onCreateNew={() => {
            setEditingHabit(null);
            setIsFormOpen(true);
          }}
        />
      </div>

      {/* Form Modal */}
      <HabitFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingHabit}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingHabit}
        onClose={() => setDeletingHabit(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Habit"
        message={`Are you sure you want to delete "${deletingHabit?.name}"?`}
      />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </AppLayout>
  );
};
