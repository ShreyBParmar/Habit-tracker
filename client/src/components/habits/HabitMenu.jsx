import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Archive, Trash2, History } from 'lucide-react';

export const HabitMenu = ({ onEdit, onArchive, onDelete, onViewHistory, isArchived }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
          {onViewHistory && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); onViewHistory(); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <History className="w-3.5 h-3.5" /> View History
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); onEdit(); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" /> Edit Habit
            </button>
          )}
          {onArchive && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); onArchive(); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
            >
              <Archive className="w-3.5 h-3.5" /> {isArchived ? 'Unarchive' : 'Archive'}
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); onDelete(); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors border-t border-gray-100 dark:border-gray-800 mt-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Habit
            </button>
          )}
        </div>
      )}
    </div>
  );
};
