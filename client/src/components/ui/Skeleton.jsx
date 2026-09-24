import React from 'react';
import { clsx } from 'clsx';

export const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={clsx(
        'animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl',
        className
      )}
    />
  );
};
