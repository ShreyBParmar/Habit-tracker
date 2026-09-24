const Habit = require('../models/Habit');
const HabitCompletion = require('../models/HabitCompletion');
const { getTodayDateString, formatDateString } = require('../utils/dateUtils');
const { calculateStreak, calculateCompletionRate } = require('../services/streakService');

// @desc    Mark a habit as completed for a date
// @route   POST /api/habits/:id/complete
// @access  Private
const completeHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found or access denied',
      });
    }

    const { date, note } = req.body;
    const targetDate = date || getTodayDateString();

    // Toggle logic: if completion record exists and completed is true, toggling completes/undoes
    let completion = await HabitCompletion.findOne({
      user: req.user._id,
      habit: habit._id,
      date: targetDate,
    });

    if (completion) {
      completion.completed = true;
      if (note !== undefined) completion.note = note;
      await completion.save();
    } else {
      completion = await HabitCompletion.create({
        user: req.user._id,
        habit: habit._id,
        date: targetDate,
        completed: true,
        note: note || '',
      });
    }

    // Recalculate streak & stats
    const completions = await HabitCompletion.find({ user: req.user._id, habit: habit._id, completed: true });
    const streakInfo = calculateStreak(habit, completions, getTodayDateString());
    const completionRate = calculateCompletionRate(habit, completions, 30, getTodayDateString());

    res.status(200).json({
      success: true,
      message: 'Habit marked as completed',
      data: {
        completion,
        currentStreak: streakInfo.currentStreak,
        longestStreak: streakInfo.longestStreak,
        completionRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Undo completion for a habit on a date
// @route   DELETE /api/habits/:id/complete/:date
// @access  Private
const undoCompletion = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found or access denied',
      });
    }

    const targetDate = req.params.date || getTodayDateString();

    await HabitCompletion.deleteOne({
      user: req.user._id,
      habit: habit._id,
      date: targetDate,
    });

    // Recalculate streak & stats
    const completions = await HabitCompletion.find({ user: req.user._id, habit: habit._id, completed: true });
    const streakInfo = calculateStreak(habit, completions, getTodayDateString());
    const completionRate = calculateCompletionRate(habit, completions, 30, getTodayDateString());

    res.status(200).json({
      success: true,
      message: 'Completion removed',
      data: {
        currentStreak: streakInfo.currentStreak,
        longestStreak: streakInfo.longestStreak,
        completionRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get completion history for a habit
// @route   GET /api/habits/:id/history
// @access  Private
const getHabitHistory = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found or access denied',
      });
    }

    const completions = await HabitCompletion.find({
      user: req.user._id,
      habit: habit._id,
    }).sort({ date: -1 });

    const streakInfo = calculateStreak(habit, completions, getTodayDateString());
    const completionRate = calculateCompletionRate(habit, completions, 30, getTodayDateString());

    res.status(200).json({
      success: true,
      data: {
        habit,
        completions,
        currentStreak: streakInfo.currentStreak,
        longestStreak: streakInfo.longestStreak,
        completionRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  completeHabit,
  undoCompletion,
  getHabitHistory,
};
