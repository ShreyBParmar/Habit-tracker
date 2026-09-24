/**
 * Date and timezone helper utilities for Habit Tracker
 */

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Format a Date object to YYYY-MM-DD
 * @param {Date} date 
 * @returns {string} YYYY-MM-DD
 */
function formatDateString(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD string to Date object at local midnight
 * @param {string} dateStr 
 * @returns {Date}
 */
function parseDateString(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Get weekday name for a YYYY-MM-DD string or Date
 * @param {string|Date} input 
 * @returns {string} e.g. "Monday"
 */
function getWeekdayName(input) {
  const date = typeof input === 'string' ? parseDateString(input) : input;
  return WEEKDAYS[date.getDay()];
}

/**
 * Get today's YYYY-MM-DD string (in local time or offset)
 * @param {number} [offsetMinutes] Optional client timezone offset in minutes
 * @returns {string}
 */
function getTodayDateString(offsetMinutes) {
  const now = new Date();
  if (typeof offsetMinutes === 'number') {
    // Convert to client local time
    const clientTime = new Date(now.getTime() - offsetMinutes * 60 * 1000);
    return formatDateString(clientTime);
  }
  return formatDateString(now);
}

/**
 * Subtract days from a YYYY-MM-DD string
 * @param {string} dateStr YYYY-MM-DD
 * @param {number} days 
 * @returns {string} YYYY-MM-DD
 */
function subtractDays(dateStr, days) {
  const d = parseDateString(dateStr);
  d.setDate(d.getDate() - days);
  return formatDateString(d);
}

/**
 * Add days to a YYYY-MM-DD string
 * @param {string} dateStr YYYY-MM-DD
 * @param {number} days 
 * @returns {string} YYYY-MM-DD
 */
function addDays(dateStr, days) {
  const d = parseDateString(dateStr);
  d.setDate(d.getDate() + days);
  return formatDateString(d);
}

module.exports = {
  WEEKDAYS,
  formatDateString,
  parseDateString,
  getWeekdayName,
  getTodayDateString,
  subtractDays,
  addDays,
};
