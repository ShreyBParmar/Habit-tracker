import React from "react";

export default function HabitList({ habits, onToggle }) {
  return (
    <div className="habit-list">
      {habits.map((habit) => (
        <div key={habit.id} className="habit-item">
          <input
            type="checkbox"
            checked={habit.selected}
            onChange={() => onToggle(habit.id)}
          />
          <span>
            <strong>{habit.name}</strong> - {habit.type.toUpperCase()}
            {habit.type === "weekly" && ` (${habit.day})`}
          </span>
        </div>
      ))}
    </div>
  );
}
