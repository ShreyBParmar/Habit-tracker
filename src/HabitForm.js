/*
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
  */

import React, { useState } from "react";

export default function HabitForm({ onAdd }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("daily");
  const [days, setDays] = useState([]); // ✅ Change to an array

  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleDayChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setDays([...days, value]);
    } else {
      setDays(days.filter((day) => day !== value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const habit = {
      name,
      type,
      days: type === "weekly" ? days.join(", ") : null, // ✅ Join the array into a string
    };
    onAdd(habit);
    setName("");
    setType("daily");
    setDays([]);
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
        <div className="days-checkbox-group">
          {allDays.map((d) => (
            <label key={d}>
              <input
                type="checkbox"
                value={d}
                checked={days.includes(d)}
                onChange={handleDayChange}
              />
              {d}
            </label>
          ))}
        </div>
      )}

      <button type="submit">➕ Add</button>
    </form>
  );
}