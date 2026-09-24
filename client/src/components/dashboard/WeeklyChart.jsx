import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

export const WeeklyChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-gray-400">
        No weekly completion data yet
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} domain={[0, 100]} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-gray-900 text-white dark:bg-gray-800 p-2.5 rounded-xl shadow-xl text-xs space-y-1">
                    <p className="font-semibold">{item.day} ({item.date})</p>
                    <p className="text-brand-300">Completion: {item.percentage}%</p>
                    <p className="text-gray-300">Completed: {item.completed} / {item.expected}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="percentage" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
