const mongoose = require('mongoose');

const habitCompletionSchema = new mongoose.Schema(
  {
    habit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
    completed: {
      type: Boolean,
      default: true,
    },
    note: {
      type: String,
      default: '',
      maxlength: [200, 'Note cannot exceed 200 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate completion records for the same user + habit + date
habitCompletionSchema.index({ user: 1, habit: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HabitCompletion', habitCompletionSchema);
