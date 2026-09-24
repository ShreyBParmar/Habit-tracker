const {
  formatDateString,
  parseDateString,
  getWeekdayName,
  getTodayDateString,
  subtractDays,
} = require('../utils/dateUtils');

/**
 * Check if a date string is an expected day for a habit
 * @param {Object} habit Habit document
 * @param {string} dateStr YYYY-MM-DD
 * @returns {boolean}
 */
function isExpectedDay(habit, dateStr) {
  const habitStartDateStr = formatDateString(habit.startDate || habit.createdAt);
  if (dateStr < habitStartDateStr) {
    return false;
  }

  if (habit.type === 'daily') {
    return true;
  }

  if (habit.type === 'weekly') {
    if (!habit.selectedDays || habit.selectedDays.length === 0) {
      return true; // Fallback if no days specified
    }
    const weekday = getWeekdayName(dateStr);
    return habit.selectedDays.includes(weekday);
  }

  return true;
}

/**
 * Calculate current streak and longest streak for a habit
 * @param {Object} habit Habit Mongoose document or JS object
 * @param {Array} completions Array of HabitCompletion documents
 * @param {string} [todayDateStr] YYYY-MM-DD
 * @returns {Object} { currentStreak, longestStreak }
 */
function calculateStreak(habit, completions = [], todayDateStr = getTodayDateString()) {
  const completedDateSet = new Set(
    completions
      .filter((c) => c.completed)
      .map((c) => c.date)
  );

  const startDateStr = formatDateString(habit.startDate || habit.createdAt);

  // Collect all expected days from startDateStr up to todayDateStr in order
  const expectedDays = [];
  let curr = startDateStr;
  while (curr <= todayDateStr) {
    if (isExpectedDay(habit, curr)) {
      expectedDays.push(curr);
    }
    curr = subtractDays(curr, -1); // add 1 day
  }

  if (expectedDays.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // 1. Calculate Longest Streak
  let longestStreak = 0;
  let tempStreak = 0;

  for (const dayStr of expectedDays) {
    if (completedDateSet.has(dayStr)) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  // 2. Calculate Current Streak
  // Walk backwards from todayDateStr
  let currentStreak = 0;
  let lastExpectedDayIndex = expectedDays.length - 1;

  if (lastExpectedDayIndex < 0) {
    return { currentStreak: 0, longestStreak };
  }

  const latestExpectedDay = expectedDays[lastExpectedDayIndex];

  // If today is an expected day, but not completed yet, check if yesterday's expected day was completed
  // We allow today to be pending without breaking an active streak from yesterday's expected day.
  if (latestExpectedDay === todayDateStr && !completedDateSet.has(todayDateStr)) {
    // Start checking from the previous expected day
    lastExpectedDayIndex--;
  }

  for (let i = lastExpectedDayIndex; i >= 0; i--) {
    const dayStr = expectedDays[i];
    if (completedDateSet.has(dayStr)) {
      currentStreak++;
    } else {
      // Missed expected day -> streak stops
      break;
    }
  }

  return { currentStreak, longestStreak };
}

/**
 * Calculate completion rate for a habit over a given window of days (e.g. 7 or 30 days)
 * @param {Object} habit 
 * @param {Array} completions 
 * @param {number} daysWindow 
 * @param {string} todayDateStr 
 * @returns {number} Percentage 0 - 100
 */
function calculateCompletionRate(habit, completions = [], daysWindow = 30, todayDateStr = getTodayDateString()) {
  const completedDateSet = new Set(
    completions
      .filter((c) => c.completed)
      .map((c) => c.date)
  );

  let expectedCount = 0;
  let completedCount = 0;

  for (let i = 0; i < daysWindow; i++) {
    const dateStr = subtractDays(todayDateStr, i);
    if (isExpectedDay(habit, dateStr)) {
      expectedCount++;
      if (completedDateSet.has(dateStr)) {
        completedCount++;
      }
    }
  }

  if (expectedCount === 0) return 0;
  return Math.round((completedCount / expectedCount) * 100);
}

module.exports = {
  isExpectedDay,
  calculateStreak,
  calculateCompletionRate,
};
