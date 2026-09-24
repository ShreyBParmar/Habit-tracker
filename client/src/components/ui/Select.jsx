import React from 'react';
import { clsx } from 'clsx';

export const Select = React.forwardRef(({
  label,
  options = [],
  error,
  className = '',
  id,
  children,
  ...props
}, ref) => {
  const selectId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={clsx(
          'w-full rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm px-4 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent cursor-pointer',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-200 dark:border-gray-800',
          className
        )}
        {...props}
      >
        {children
          ? children
          : options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
