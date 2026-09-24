import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/dashboard/StatCard';
import { WeeklyChart } from '../components/dashboard/WeeklyChart';
import { Skeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';
import { StreakBadge } from '../components/habits/StreakBadge';
import { Award, Flame, TrendingUp, CheckSquare, Target } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { habitService } from '../services/habitService';

export const AnalyticsPage = () => {
  const [summary, setSummary] = useState(null);
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [sumRes, habRes] = await Promise.all([
          dashboardService.getSummary(),
          habitService.getHabits(),
        ]);
        if (sumRes.success) setSummary(sumRes.data);
        if (habRes.success) setHabits(habRes.data);
      } catch (err) {
        console.error('Error loading analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <AppLayout title="Analytics & Consistency Insights">
        <div className="space-y-6">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Analytics & Insights">
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Consistency Rate"
            value={`${summary?.completionPercentage || 0}%`}
            subtitle="30-day average"
            icon={TrendingUp}
            color="emerald"
          />
          <StatCard
            title="Active Habits"
            value={summary?.totalHabits || 0}
            subtitle="Tracked habits"
            icon={Target}
            color="brand"
          />
          <StatCard
            title="Max Streak"
            value={`${summary?.longestStreak || 0} Days`}
            subtitle="All-time record"
            icon={Flame}
            color="amber"
          />
          <StatCard
            title="Completed Today"
            value={summary?.completedToday || 0}
            subtitle="Daily goal"
            icon={Award}
            color="purple"
          />
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
            7-Day Completion Rate (%)
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Percentage of expected daily/weekly habit goals accomplished each day.
          </p>
          <WeeklyChart data={summary?.weeklyProgress || []} />
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">
            Habit Performance Breakdown
          </h3>
          <div className="space-y-3">
            {habits.map((h) => (
              <div
                key={h._id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs"
                    style={{ backgroundColor: h.color || '#3B82F6' }}
                  >
                    {h.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{h.name}</h4>
                    <span className="text-xs text-gray-400 capitalize">{h.type} habit</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <StreakBadge count={h.currentStreak || 0} size="sm" />
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{h.completionRate || 0}%</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">30-day rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
