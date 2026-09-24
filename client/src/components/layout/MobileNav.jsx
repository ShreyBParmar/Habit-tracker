import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, BarChart2, User } from 'lucide-react';

export const MobileNav = () => {
  const navItems = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Habits', path: '/habits', icon: CheckSquare },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-2 py-2 flex items-center justify-around shadow-lg">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-medium transition-colors ${
              isActive
                ? 'text-brand-600 dark:text-brand-400 font-bold'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`
          }
        >
          <item.icon className="w-5 h-5" />
          <span>{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};
