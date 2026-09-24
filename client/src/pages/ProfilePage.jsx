import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { User, Mail, Calendar, Moon, Sun, LogOut, ShieldCheck } from 'lucide-react';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <AppLayout title="My Profile">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="flex flex-col sm:flex-row items-center gap-6 p-6 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-brand-600 text-white font-bold text-3xl flex items-center justify-center shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{user?.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-4 h-4" /> {user?.email}
            </p>
            <p className="text-xs text-gray-400 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
              <Calendar className="w-3.5 h-3.5" /> Member since {joinedDate}
            </p>
          </div>
        </Card>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
            Preferences & Appearance
          </h4>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Interface Theme</p>
                <p className="text-xs text-gray-400">Current theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              Switch Theme
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Security</p>
                <p className="text-xs text-gray-400">JWT Token Authentication & Encrypted Passwords</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button variant="danger" size="lg" className="w-full" onClick={logout}>
            <LogOut className="w-4 h-4" /> Log Out of Account
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};
