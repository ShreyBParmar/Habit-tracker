const Habit = require('../models/Habit');
const HabitCompletion = require('../models/HabitCompletion');
const { getTodayDateString, subtractDays, getWeekdayName } = require('../utils/dateUtils');
const { calculateStreak, isExpectedDay, calculateCompletionRate } = require('../services/streakService');

// @desc    Get dashboard summary statistics
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res, next) => {
  try {
    const todayDateStr = getTodayDateString();

    // Fetch active habits for user
    const habits = await Habit.find({ user: req.user._id, isArchived: false });
    const allCompletions = await HabitCompletion.find({ user: req.user._id, completed: true });

    // Completed today set
    const todayCompletedHabitIds = new Set(
      allCompletions.filter((c) => c.date === todayDateStr).map((c) => c.habit.toString())
    );

    let completedToday = 0;
    let pendingToday = 0;
    let maxCurrentStreak = 0;
    let maxLongestStreak = 0;
    let totalRatesSum = 0;

    habits.forEach((habit) => {
      const isCompleted = todayCompletedHabitIds.has(habit._id.toString());
      const isExpected = isExpectedDay(habit, todayDateStr);

      if (isCompleted) {
        completedToday++;
      } else if (isExpected) {
        pendingToday++;
      }

      const habitCompletions = allCompletions.filter((c) => c.habit.toString() === habit._id.toString());
      const streak = calculateStreak(habit, habitCompletions, todayDateStr);
      const rate = calculateCompletionRate(habit, habitCompletions, 30, todayDateStr);

      if (streak.currentStreak > maxCurrentStreak) maxCurrentStreak = streak.currentStreak;
      if (streak.longestStreak > maxLongestStreak) maxLongestStreak = streak.longestStreak;
      totalRatesSum += rate;
    });

    const averageCompletionRate = habits.length > 0 ? Math.round(totalRatesSum / habits.length) : 0;

    // Build 7-day weekly progress array (from 6 days ago to today)
    const weeklyProgress = [];
    for (let i = 6; i >= 0; i--) {
      const dateStr = subtractDays(todayDateStr, i);
      const dayName = getWeekdayName(dateStr).substring(0, 3);

      let dayExpected = 0;
      let dayCompleted = 0;

      habits.forEach((habit) => {
        if (isExpectedDay(habit, dateStr)) {
          dayExpected++;
          if (allCompletions.some((c) => c.habit.toString() === habit._id.toString() && c.date === dateStr)) {
            dayCompleted++;
          }
        }
      });

      const percentage = dayExpected > 0 ? Math.round((dayCompleted / dayExpected) * 100) : 0;

      weeklyProgress.push({
        date: dateStr,
        day: dayName,
        completed: dayCompleted,
        expected: dayExpected,
        percentage,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalHabits: habits.length,
        completedToday,
        pendingToday,
        currentStreak: maxCurrentStreak,
        longestStreak: maxLongestStreak,
        completionPercentage: averageCompletionRate,
        weeklyProgress,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
};
