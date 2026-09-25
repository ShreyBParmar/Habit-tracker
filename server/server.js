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

// 1. ABSOLUTE TOP: Bulletproof Global CORS & Preflight Response Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');

  // Instant 200 OK response for preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// 2. Connect to MongoDB
connectDB();

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
