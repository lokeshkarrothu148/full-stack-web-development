/**
 * ====================================================================
 * CollegeHub – Smart College Management System
 * Main Application Server
 * File: server.js
 * ====================================================================
 * Initializes Express, establishes persistent MySQL session storage,
 * configures middleware, mounts REST API endpoints, and serves static frontend assets.
 * ====================================================================
 */

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');
const fs = require('fs');

// Import Database Connection Pool
const pool = require('./config/database');

// Import Modular API Route Handlers
const authRoutes = require('./routes/auth');
const studentsRoutes = require('./routes/students');
const materialsRoutes = require('./routes/materials');
const assignmentsRoutes = require('./routes/assignments');
const announcementsRoutes = require('./routes/announcements');
const eventsRoutes = require('./routes/events');
const feedbackRoutes = require('./routes/feedback');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure necessary directories exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// --------------------------------------------------------------------
// 1. Core Request Parsers
// --------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------------------------------------------------------
// 2. Persistent MySQL Session Store Setup
// --------------------------------------------------------------------
const sessionStoreOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'collegehub',
  clearExpired: true,
  checkExpirationInterval: 900000, // Clear expired sessions every 15 minutes
  expiration: 86400000,            // Valid for 1 day (in milliseconds)
  createDatabaseTable: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
};

let sessionStore;
try {
  sessionStore = new MySQLStore(sessionStoreOptions);
  console.log('[Session] Persistent MySQL session store initialized.');
} catch (sessionErr) {
  console.warn('[Session Warning] Could not connect persistent MySQL session store:', sessionErr.message);
  console.warn('[Session Warning] Falling back to default session store.');
}

app.use(
  session({
    key: 'collegehub.sid',
    secret: process.env.SESSION_SECRET || 'collegehub_super_secret_session_key_2024',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    }
  })
);

// --------------------------------------------------------------------
// 3. Static Assets & File Hosting
// --------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --------------------------------------------------------------------
// 4. API Endpoints Mounting
// --------------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    application: 'CollegeHub – Smart College Management System',
    timestamp: new Date().toISOString()
  });
});

// --------------------------------------------------------------------
// 5. 404 & Global Error Handling
// --------------------------------------------------------------------
// Handle unknown API endpoints
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.method} ${req.originalUrl}' not found.`
  });
});

// Fallback for page requests not matching static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global internal server error handler
app.use((err, req, res, next) => {
  console.error('[Internal Server Error]:', err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.'
  });
});

// --------------------------------------------------------------------
// 6. Start HTTP Server
// --------------------------------------------------------------------
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(` CollegeHub Server is running on port ${PORT}`);
  console.log(` Web Portal URL: http://localhost:${PORT}`);
  console.log(` Environment:    ${process.env.NODE_ENV || 'development'}`);
  console.log('====================================================');
});

