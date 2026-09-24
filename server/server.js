require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const habitRoutes = require('./routes/habitRoutes');
const completionRoutes = require('./routes/completionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const clientUrl = process.env.CLIENT_URL || '*';
app.use(
  cors({
    origin: clientUrl === '*' ? true : [clientUrl, 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/habits', completionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'MERN Habit Tracker API is running' });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
