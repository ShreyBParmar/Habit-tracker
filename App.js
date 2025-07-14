import React, { useState } from "react";
import HabitForm from "./HabitForm";
import HabitList from "./HabitList";
import "./App.css";

export default function App() {
  const [habits, setHabits] = useState([]);

  const addHabit = (habit) => {
    setHabits([...habits, { ...habit, id: Date.now(), selected: false }]);
  };

  const toggleSelect = (id) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id ? { ...habit, selected: !habit.selected } : habit
      )
    );
  };

  const deleteSelected = () => {
    setHabits(habits.filter((habit) => !habit.selected));
  };

  return (
    <div className="container">
      <h1>🧘 Habit Tracker</h1>
      <HabitForm onAdd={addHabit} />
      <HabitList habits={habits} onToggle={toggleSelect} />
      <button className="delete-btn" onClick={deleteSelected}>
        🗑️ Delete Selected
      </button>
    </div>
  );
}
