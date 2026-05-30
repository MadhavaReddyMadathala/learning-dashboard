import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollRoutes from './routes/enrollRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// 🔐 CORS (safe for production + fallback)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Base route
app.get('/', (req, res) => {
  res.send('Learning Dashboard API is active');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enroll', enrollRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

// 🚀 SAFE START (IMPORTANT FIX)
connectDB()
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
      );
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
