import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Flame, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 dark:bg-brand-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
            <Flame className="w-7 h-7 fill-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome back</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Log in to track your habits and maintain your streak.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/60 dark:border-rose-900/40 dark:text-rose-300 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
            Log In <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};
