const express = require('express');
const router = express.Router();
const {
  completeHabit,
  undoCompletion,
  getHabitHistory,
} = require('../controllers/completionController');
const { protect } = require('../middleware/auth');

router.use(protect); // Protect all completion routes

router.post('/:id/complete', completeHabit);
router.delete('/:id/complete/:date?', undoCompletion);
router.get('/:id/history', getHabitHistory);

module.exports = router;
