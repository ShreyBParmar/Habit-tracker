import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { WEEKDAYS, formatDateString } from '../../utils/dateUtils';

const COLOR_OPTIONS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Rose', value: '#F43F5E' },
  { name: 'Indigo', value: '#6366F1' },
];

export const HabitFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('daily');
  const [selectedDays, setSelectedDays] = useState(['Monday', 'Wednesday', 'Friday']);
  const [color, setColor] = useState('#3B82F6');
  const [startDate, setStartDate] = useState(formatDateString());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setType(initialData.type || 'daily');

      let days = initialData.selectedDays;
      if (!days && typeof initialData.days === 'string') {
        days = initialData.days.split(',').map(d => d.trim()).filter(Boolean);
      }
      setSelectedDays(Array.isArray(days) && days.length > 0 ? days : ['Monday', 'Wednesday', 'Friday']);
      setColor(initialData.color || '#3B82F6');
      setStartDate(initialData.startDate ? formatDateString(initialData.startDate) : formatDateString());
    } else {
      setName('');
      setDescription('');
      setType('daily');
      setSelectedDays(['Monday', 'Wednesday', 'Friday']);
      setColor('#3B82F6');
      setStartDate(formatDateString());
    }
    setErrors({});
  }, [initialData, isOpen]);

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Habit name is required';
    if (type === 'weekly' && selectedDays.length === 0)
      newErrors.selectedDays = 'Select at least one weekday for weekly habits';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      type,
      selectedDays: type === 'weekly' ? selectedDays : [],
      color,
      startDate,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Habit' : 'Create New Habit'} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Habit Name *"
          placeholder="e.g. Read 20 pages, Morning Exercise"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoFocus
        />

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Description (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Why do you want to build this habit?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm px-4 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select label="Frequency" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="daily">Daily Habit</option>
            <option value="weekly">Weekly Habit</option>
          </Select>
          <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>

        {type === 'weekly' && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Selected Weekdays *
            </label>
            <div className="grid grid-cols-7 gap-1.5">
              {WEEKDAYS.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`py-2 px-1 text-xs font-medium rounded-xl border transition-all text-center ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm dark:bg-brand-500'
                        : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                );
              })}
            </div>
            {errors.selectedDays && <p className="text-xs text-red-500">{errors.selectedDays}</p>}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
            Habit Color Accent
          </label>
          <div className="flex items-center gap-3">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                style={{ backgroundColor: c.value }}
                className={`w-7 h-7 rounded-full transition-transform ${
                  color === c.value ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-110'
                }`}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-6">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? 'Save Changes' : 'Create Habit'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
