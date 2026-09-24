import React from 'react';
import { Card } from '../ui/Card';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'brand' }) => {
  const colorStyles = {
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
  };

  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorStyles[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </Card>
  );
};
