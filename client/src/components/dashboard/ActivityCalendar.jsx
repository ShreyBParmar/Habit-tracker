import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { getWeekdayName, formatDateString } from '../../utils/dateUtils';

export const ActivityCalendar = ({ habit, completions = [], onToggleDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  if (!habit) return null;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Mon=0, Sun=6

  const todayStr = formatDateString(new Date());
  const habitStartStr = formatDateString(habit.startDate || habit.createdAt);

  const completedDatesSet = new Set(
    completions.filter(c => c.completed).map(c => c.date)
  );

  const selectedDaysList = habit.selectedDays && habit.selectedDays.length > 0
    ? habit.selectedDays
    : (typeof habit.days === 'string' ? habit.days.split(',').map(d => d.trim()).filter(Boolean) : []);

  const isExpected = (dateStr) => {
    if (dateStr < habitStartStr) return false;
    if (habit.type === 'daily') return true;
    if (habit.type === 'weekly') {
      const dayName = getWeekdayName(dateStr);
      return selectedDaysList.some(d => d.trim().toLowerCase() === dayName.toLowerCase());
    }
    return true;
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push(dayStr);
  }

  const monthName = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">{monthName}</h4>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <span key={day} className="text-xs font-semibold text-gray-400 dark:text-gray-500 py-1">{day}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((dateStr, index) => {
          if (!dateStr) return <div key={`empty-${index}`} className="h-10 rounded-xl" />;

          const dayNumber = parseInt(dateStr.split('-')[2], 10);
          const isCompleted = completedDatesSet.has(dateStr);
          const expected = isExpected(dateStr);
          const isFuture = dateStr > todayStr;
          const isToday = dateStr === todayStr;

          let bgClass = 'bg-gray-50 text-gray-400 dark:bg-gray-800/40 dark:text-gray-600';
          if (isCompleted) bgClass = 'bg-emerald-500 text-white font-bold shadow-sm';
          else if (isFuture) bgClass = 'bg-gray-50 text-gray-300 dark:bg-gray-950 dark:text-gray-700 cursor-not-allowed';
          else if (expected) bgClass = 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40';

          return (
            <button
              key={dateStr}
              disabled={isFuture}
              onClick={() => onToggleDate && onToggleDate(habit, dateStr, isCompleted)}
              className={`h-10 rounded-xl flex flex-col items-center justify-center text-xs transition-all relative ${bgClass} ${
                isToday ? 'ring-2 ring-brand-500 ring-offset-1' : ''
              } ${!isFuture ? 'hover:scale-105 cursor-pointer' : ''}`}
            >
              <span>{dayNumber}</span>
              {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : expected && !isFuture ? <X className="w-2.5 h-2.5 opacity-60" /> : null}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-emerald-500" /> Completed</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-rose-100 border border-rose-200 dark:bg-rose-950 dark:border-rose-800" /> Missed</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-gray-100 dark:bg-gray-800" /> Off / Future</div>
      </div>
    </div>
  );
};
