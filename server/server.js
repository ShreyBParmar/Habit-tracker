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

// Robust CORS Middleware
const clientUrl = process.env.CLIENT_URL || '*';
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
];

if (clientUrl && clientUrl !== '*') {
  const cleanUrl = clientUrl.replace(/\/$/, '');
  allowedOrigins.push(cleanUrl);
  allowedOrigins.push(`${cleanUrl}/`);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching origins
      if (!origin || clientUrl === '*' || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(null, true); // Fallback allow for Vercel preview deployments
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

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
