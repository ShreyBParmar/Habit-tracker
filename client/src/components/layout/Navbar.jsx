import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = ({ title }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title || 'Dashboard'}</h2>
        <p className="text-xs text-gray-400 font-medium">{todayFormatted}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-semibold flex items-center justify-center text-xs">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="hidden sm:inline text-xs font-semibold text-gray-700 dark:text-gray-300">{user?.name}</span>
        </div>
      </div>
    </header>
  );
};
