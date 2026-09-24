const Habit = require('../models/Habit');
const HabitCompletion = require('../models/HabitCompletion');
const { calculateStreak, isExpectedDay, calculateCompletionRate } = require('../services/streakService');
const { getTodayDateString } = require('../utils/dateUtils');

// @desc    Get authenticated user's habits
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res, next) => {
  try {
    const { archived, date } = req.query;
    const targetDateStr = date || getTodayDateString();

    const query = { user: req.user._id };
    if (archived === 'true') {
      query.isArchived = true;
    } else if (archived === 'all') {
      // return both
    } else {
      query.isArchived = false;
    }

    const habits = await Habit.find(query).sort({ createdAt: -1 });

    // Fetch all completions for this user to compute streaks & completed state
    const completions = await HabitCompletion.find({ user: req.user._id, completed: true });

    // Build completion map by habit ID and date
    const completedTodayMap = new Set(
      completions.filter((c) => c.date === targetDateStr).map((c) => c.habit.toString())
    );

    const habitsWithStats = habits.map((habit) => {
      const habitCompletions = completions.filter((c) => c.habit.toString() === habit._id.toString());
      const streakInfo = calculateStreak(habit, habitCompletions, targetDateStr);
      const isExpectedToday = isExpectedDay(habit, targetDateStr);
      const completionRate = calculateCompletionRate(habit, habitCompletions, 30, targetDateStr);

      return {
        ...habit.toObject(),
        completedToday: completedTodayMap.has(habit._id.toString()),
        currentStreak: streakInfo.currentStreak,
        longestStreak: streakInfo.longestStreak,
        completionRate,
        isExpectedToday,
      };
    });

    res.status(200).json({
      success: true,
      count: habitsWithStats.length,
      data: habitsWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single habit by ID
// @route   GET /api/habits/:id
// @access  Private
const getHabitById = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found or access denied',
      });
    }

    const todayDateStr = getTodayDateString();
    const completions = await HabitCompletion.find({ habit: habit._id, user: req.user._id, completed: true });
    const streakInfo = calculateStreak(habit, completions, todayDateStr);
    const completionRate = calculateCompletionRate(habit, completions, 30, todayDateStr);
    const isCompletedToday = completions.some((c) => c.date === todayDateStr);

    res.status(200).json({
      success: true,
      data: {
        ...habit.toObject(),
        completedToday: isCompletedToday,
        currentStreak: streakInfo.currentStreak,
        longestStreak: streakInfo.longestStreak,
        completionRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a habit
// @route   POST /api/habits
// @access  Private
const createHabit = async (req, res, next) => {
  try {
    const { name, description, type, selectedDays, days, color, icon, startDate, target } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Habit name is required',
      });
    }

    // Preserve compatibility with legacy frontend sending `days` string
    let parsedDays = selectedDays;
    if (!parsedDays && typeof days === 'string') {
      parsedDays = days.split(',').map((d) => d.trim()).filter(Boolean);
    }
    if (!Array.isArray(parsedDays)) {
      parsedDays = [];
    }

    if (type === 'weekly' && parsedDays.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one weekday must be selected for weekly habits',
      });
    }

    const habit = await Habit.create({
      user: req.user._id,
      name: name.trim(),
      description: description ? description.trim() : '',
      type: type === 'weekly' ? 'weekly' : 'daily',
      selectedDays: parsedDays,
      color: color || '#3B82F6',
      icon: icon || 'target',
      startDate: startDate ? new Date(startDate) : new Date(),
      target: target ? Number(target) : 1,
    });

    res.status(201).json({
      success: true,
      message: 'Habit created successfully',
      data: {
        ...habit.toObject(),
        completedToday: false,
        currentStreak: 0,
        longestStreak: 0,
        completionRate: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res, next) => {
  try {
    let habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found or access denied',
      });
    }

    const { name, description, type, selectedDays, days, color, icon, startDate, target, isArchived } = req.body;

    if (name) habit.name = name.trim();
    if (description !== undefined) habit.description = description.trim();
    if (type) habit.type = type;
    if (color) habit.color = color;
    if (icon) habit.icon = icon;
    if (startDate) habit.startDate = new Date(startDate);
    if (target) habit.target = Number(target);
    if (isArchived !== undefined) habit.isArchived = Boolean(isArchived);

    // Handle days / selectedDays array parsing
    if (selectedDays || days !== undefined) {
      let parsedDays = selectedDays;
      if (!parsedDays && typeof days === 'string') {
        parsedDays = days.split(',').map((d) => d.trim()).filter(Boolean);
      }
      if (Array.isArray(parsedDays)) {
        habit.selectedDays = parsedDays;
      }
    }

    await habit.save();

    res.status(200).json({
      success: true,
      message: 'Habit updated successfully',
      data: habit,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete or archive habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res, next) => {
  try {
    const { archiveOnly } = req.query;

    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found or access denied',
      });
    }

    if (archiveOnly === 'true') {
      habit.isArchived = true;
      await habit.save();
      return res.status(200).json({
        success: true,
        message: 'Habit archived successfully',
        id: habit._id,
      });
    }

    // Hard delete habit and associated completion history
    await Habit.deleteOne({ _id: habit._id });
    await HabitCompletion.deleteMany({ habit: habit._id });

    res.status(200).json({
      success: true,
      message: 'Habit deleted successfully',
      id: habit._id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHabits,
  getHabitById,
  createHabit,
  updateHabit,
  deleteHabit,
};
