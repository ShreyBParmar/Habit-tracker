const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Habit name is required'],
      trim: true,
      maxlength: [100, 'Habit name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    type: {
      type: String,
      enum: ['daily', 'weekly'],
      default: 'daily',
      required: true,
    },
    selectedDays: {
      type: [String],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      default: [],
    },
    color: {
      type: String,
      default: '#3B82F6', // Tailwind blue-500 default
    },
    icon: {
      type: String,
      default: 'target',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    target: {
      type: Number,
      default: 1,
      min: 1,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly fetch active habits for a user
habitSchema.index({ user: 1, isArchived: 1 });

module.exports = mongoose.model('Habit', habitSchema);
