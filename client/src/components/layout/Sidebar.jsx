import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, Calendar as CalendarIcon,
  BarChart2, User, LogOut, Moon, Sun, Flame,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Habits', path: '/habits', icon: CheckSquare },
    { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 h-screen sticky top-0 p-5 select-none shrink-0 justify-between">
      <div>
        <div className="flex items-center gap-3 px-3 py-2 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-brand-600 dark:bg-brand-500 flex items-center justify-center text-white shadow-md">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-gray-900 dark:text-gray-100">HabitFlow</h1>
            <p className="text-[11px] text-gray-400 font-medium">MERN Productivity</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            {theme === 'dark'
              ? <Sun className="w-4 h-4 text-amber-400" />
              : <Moon className="w-4 h-4 text-indigo-500" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>

        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-semibold flex items-center justify-center text-xs shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
