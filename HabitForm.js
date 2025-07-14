import React, { useState } from "react";

export default function HabitForm({ onAdd }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("daily");
  const [day, setDay] = useState("Monday");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const habit = {
      name,
      type,
      day: type === "weekly" ? day : null,
    };
    onAdd(habit);
    setName("");
    setType("daily");
    setDay("Monday");
  };

  return (
    <form onSubmit={handleSubmit} className="habit-form">
      <input
        type="text"
        placeholder="Enter Habit"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>

      {type === "weekly" && (
        <select value={day} onChange={(e) => setDay(e.target.value)}>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      )}

      <button type="submit">➕ Add</button>
    </form>
  );
}
