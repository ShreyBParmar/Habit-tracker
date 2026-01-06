/*
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors()); // allow frontend requests
app.use(bodyParser.json());

// ✅ Connect to MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_password",  // replace with your root password
  database: "HabitTrackerDB"
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ Connected to MySQL!");
});

// ✅ API to insert a habit
app.post("/add-habit", (req, res) => {
  const { habit, frequency } = req.body; // from React form
  const sql = "INSERT INTO habits (habit, status, date, notes) VALUES (?, ?, ?, ?)";
  db.query(sql, [habit, frequency, new Date(), ""], (err, result) => {
    if (err) {
      console.error("❌ Error inserting habit:", err);
      return res.status(500).send("Database error");
    }
    res.send("✅ Habit added successfully!");
  });
});

// ✅ Delete habit by id
app.delete("/habits/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM habits WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "✅ Habit deleted", id });
  });
});


// Run server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
*/

require('dotenv').config(); 

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user:  process.env.DB_USER || "root",
  password:  process.env.DB_PASSWORD || "user#10911#messi", 
  database:  process.env.DB_NAME || "habittrackerdb"
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ Connected to MySQL!");
});

/*
// ✅ API to get all habits
app.get("/habits", (req, res) => {
  const sql = "SELECT * FROM habits";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error fetching habits:", err);
      return res.status(500).send("Database error");
    }
    res.json(result); // Send the results as JSON
  });
});

// ✅ API to insert a habit
app.post("/habits", (req, res) => {
  const { name, type, day } = req.body;
  const sql = "INSERT INTO habits (name, type, day) VALUES (?, ?, ?)";
  db.query(sql, [name, type, day], (err, result) => {
    if (err) {
      console.error("❌ Error inserting habit:", err);
      return res.status(500).send("Database error");
    }
    // Return the newly created habit, including its id from the database
    const newHabit = { id: result.insertId, name, type, day };
    res.status(201).json(newHabit);
  });
});
*/

// ✅ API to get all habits
app.get("/habits", (req, res) => {
  const sql = "SELECT * FROM habits";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error fetching habits:", err);
      return res.status(500).send("Database error");
    }
    res.json(result);
  });
});

// ✅ API to insert a habit
app.post("/habits", (req, res) => {
  const { name, type, days } = req.body; // ✅ Update destructuring
  const sql = "INSERT INTO habits (name, type, days) VALUES (?, ?, ?)"; // ✅ Update column name
  db.query(sql, [name, type, days], (err, result) => {
    if (err) {
      console.error("❌ Error inserting habit:", err);
      return res.status(500).send("Database error");
    }
    const newHabit = { id: result.insertId, name, type, days };
    res.status(201).json(newHabit);
  });
});

// ✅ Delete habit by id
app.delete("/habits/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM habits WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error deleting habit:", err);
      return res.status(500).send("Database error");
    }
    res.json({ message: "✅ Habit deleted", id });
  });
});

// Run server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});