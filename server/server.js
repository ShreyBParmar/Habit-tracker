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

// Universal Fail-Safe CORS Configuration
app.use(
  cors({
    origin: true, // Reflect request origin (e.g. Vercel frontend, local dev)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

// Explicit preflight OPTIONS response for all routes
app.options('*', cors());

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/habits', completionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root & Health check endpoints
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'MERN Habit Tracker API is running' });
});

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'MERN Habit Tracker API Server' });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
