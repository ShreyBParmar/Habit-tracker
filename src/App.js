/*
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
        🗑️ Delete 
      </button>
    </div>
  );
}
*/

import React, { useState, useEffect } from "react";
import HabitForm from "./HabitForm";
import HabitList from "./HabitList";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function App() {
  const [habits, setHabits] = useState([]);

  // Load habits from the backend on component mount
  useEffect(() => {
   // fetch("http://localhost:5000/habits") // The backend URL
   fetch(`${API_URL}/habits`)
      .then((res) => res.json())
      .then((data) =>
        // Ensure each habit has a `selected` property for the checkbox state
        setHabits(Array.isArray(data) ? data.map((h) => ({ ...h, selected: false })) : [])
      )
      .catch((error) => console.error("Error fetching habits:", error));
  }, []);

  // Add a new habit by sending it to the backend
  const addHabit = async (habit) => {
    try {
      const res = await fetch(`${API_URL}/habits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habit),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const newHabit = await res.json();
      // Ensure newly added habit has `selected` defaulted to false
      setHabits((prev) => [...prev, { ...newHabit, selected: false }]);
    } catch (error) {
      console.error("Error adding habit:", error);
      // Fallback: if backend isn't available, add the habit locally so UI updates immediately
      const fallback = { ...habit, id: Date.now(), selected: false };
      setHabits((prev) => [...prev, fallback]);
    }
  };

  // The delete function will also need to be updated to make a backend call 

  const deleteSelected = async () => {
    const selectedHabitIds = habits.filter((habit) => habit.selected).map((habit) => habit.id);

    try {
      // Sending a DELETE request for each selected habit
      await Promise.all(
        selectedHabitIds.map((id) =>
          fetch(`${API_URL}/habits/${id}`, { method: "DELETE" })
        )
      );
      // Update the state to reflect the deletion (functional update to avoid stale closures)
      setHabits((prev) => prev.filter((habit) => !habit.selected));
    } catch (error) {
      console.error("Error deleting habits:", error);
      // Fallback: remove selected habits locally so UI stays responsive
      setHabits((prev) => prev.filter((habit) => !habit.selected));
    }
  };

   const toggleSelect = (id) => {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === id ? { ...habit, selected: !habit.selected } : habit))
    );
  };
  return (
    <div className="container">
      <h1>🧘 Habit Tracker</h1>
      <HabitForm onAdd={addHabit} />
      <HabitList habits={habits} onToggle={toggleSelect} />
      <button className="delete-btn" onClick={deleteSelected}>
        🗑️ Delete 
      </button>
    </div>
  );
}

// toggleSelect function would also need to be updated for a PUT request