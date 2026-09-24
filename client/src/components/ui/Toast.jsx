import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ type = 'success', message, onClose }) => {
  if (!message) return null;

  const styles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800/40',
    error: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800/40',
    info: 'bg-brand-50 text-brand-800 border-brand-200 dark:bg-brand-950 dark:text-brand-200 dark:border-brand-800/40',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0" />,
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg transition-all ${styles[type]}`}>
      {icons[type]}
      <p className="text-sm font-medium">{message}</p>
      {onClose && (
        <button onClick={onClose} className="p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
