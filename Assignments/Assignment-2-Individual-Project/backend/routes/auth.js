/**
 * ====================================================================
 * Authentication Routes
 * File: routes/auth.js
 * ====================================================================
 * Endpoints:
 *   POST /api/auth/register  -> Registers a new student account
 *   POST /api/auth/login     -> Authenticates student or admin credentials
 *   POST /api/auth/logout    -> Destroys active session
 *   GET  /api/auth/me        -> Returns current authenticated user profile
 * ====================================================================
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

/**
 * Basic Email Format Validation Regex
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// --------------------------------------------------------------------
// 1. POST /api/auth/register (Student Registration)
// --------------------------------------------------------------------
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, branch } = req.body;

    // Server-side validation
    if (!name || !email || !password || !branch) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, email, password, branch) are required.'
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedBranch = branch.trim();

    if (trimmedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long.'
      });
    }

    if (!isValidEmail(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check if email already registered (Duplicate Email Check)
    const [existingUsers] = await db.execute(
      'SELECT id FROM students WHERE email = ?',
      [trimmedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.'
      });
    }

    // Hash the password with bcrypt (10 salt rounds)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // SECURITY: Always set role to 'student'. Never trust client-supplied role.
    const userRole = 'student';

    const [result] = await db.execute(
      'INSERT INTO students (name, email, password, branch, role) VALUES (?, ?, ?, ?, ?)',
      [trimmedName, trimmedEmail, hashedPassword, trimmedBranch, userRole]
    );

    // Establish session immediately after registration
    const newUser = {
      id: result.insertId,
      name: trimmedName,
      email: trimmedEmail,
      branch: trimmedBranch,
      role: userRole
    };

    req.session.user = newUser;

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to CollegeHub.',
      user: newUser,
      redirectTo: '/dashboard.html'
    });
  } catch (error) {
    console.error('[Auth Error - Register]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred during registration. Please try again later.'
    });
  }
});

// --------------------------------------------------------------------
// 2. POST /api/auth/login (Student & Administrator Login)
// --------------------------------------------------------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Query database for user by email using parameterized query
    const [rows] = await db.execute(
      'SELECT id, name, email, password, branch, role FROM students WHERE email = ?',
      [trimmedEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const user = rows[0];

    // Verify password against stored bcrypt hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Attach user profile to session (excluding password)
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      branch: user.branch,
      role: user.role
    };

    // Determine redirect destination based on role
    const redirectTo = user.role === 'admin' ? '/admin.html' : '/dashboard.html';

    return res.status(200).json({
      success: true,
      message: `Login successful! Welcome back, ${user.name}.`,
      user: req.session.user,
      redirectTo
    });
  } catch (error) {
    console.error('[Auth Error - Login]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.'
    });
  }
});

// --------------------------------------------------------------------
// 3. POST /api/auth/logout (Session Destruction)
// --------------------------------------------------------------------
router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('[Auth Error - Logout]:', err);
        return res.status(500).json({
          success: false,
          message: 'Could not log out at this moment. Please try again.'
        });
      }

      // Clear cookie
      res.clearCookie('connect.sid');
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully.',
        redirectTo: '/login.html'
      });
    });
  } else {
    return res.status(200).json({
      success: true,
      message: 'Already logged out.',
      redirectTo: '/login.html'
    });
  }
});

// --------------------------------------------------------------------
// 4. GET /api/auth/me (Current Authenticated User Profile)
// --------------------------------------------------------------------
router.get('/me', (req, res) => {
  if (req.session && req.session.user) {
    return res.status(200).json({
      success: true,
      authenticated: true,
      user: req.session.user
    });
  }

  return res.status(401).json({
    success: false,
    authenticated: false,
    message: 'No active session found.'
  });
});

module.exports = router;

