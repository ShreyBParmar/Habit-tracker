import React from 'react';
import { clsx } from 'clsx';

export const Card = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-5',
        onClick && 'cursor-pointer hover:border-gray-300 dark:hover:border-gray-700',
        className
      )}
    >
      {children}
    </div>
  );
};
