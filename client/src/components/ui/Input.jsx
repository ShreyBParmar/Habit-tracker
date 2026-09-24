import React from 'react';
import { clsx } from 'clsx';

export const Input = React.forwardRef(({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm px-4 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            Icon && 'pl-10',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-200 dark:border-gray-800',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
