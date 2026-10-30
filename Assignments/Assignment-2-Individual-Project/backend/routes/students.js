/**
 * ====================================================================
 * Students Management Routes
 * File: routes/students.js
 * ====================================================================
 * Endpoints:
 *   GET    /api/students        -> Get all registered students (Admin only)
 *   GET    /api/students/stats  -> Get dashboard analytical statistics (Admin only)
 *   DELETE /api/students/:id    -> Remove a student account (Admin only)
 * ====================================================================
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

// --------------------------------------------------------------------
// 1. GET /api/students (Retrieve All Students - Admin Only)
// --------------------------------------------------------------------
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const [students] = await db.execute(
      'SELECT id, name, email, branch, role, created_at FROM students ORDER BY created_at DESC'
    );

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('[Students Error - Fetch All]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve students records.'
    });
  }
});

// --------------------------------------------------------------------
// 2. GET /api/students/stats (Aggregate Dashboard Statistics - Admin Only)
// --------------------------------------------------------------------
router.get('/stats', isAuthenticated, isAdmin, async (req, res) => {
  try {
    // Run counting queries concurrently for high performance
    const [
      [studentCount],
      [materialCount],
      [assignmentCount],
      [announcementCount],
      [eventCount],
      [feedbackCount]
    ] = await Promise.all([
      db.execute("SELECT COUNT(*) AS total FROM students WHERE role = 'student'"),
      db.execute('SELECT COUNT(*) AS total FROM materials'),
      db.execute('SELECT COUNT(*) AS total FROM assignments'),
      db.execute('SELECT COUNT(*) AS total FROM announcements'),
      db.execute('SELECT COUNT(*) AS total FROM events'),
      db.execute('SELECT COUNT(*) AS total FROM feedback')
    ]);

    return res.status(200).json({
      success: true,
      data: {
        students: studentCount[0].total,
        materials: materialCount[0].total,
        assignments: assignmentCount[0].total,
        announcements: announcementCount[0].total,
        events: eventCount[0].total,
        feedback: feedbackCount[0].total
      }
    });
  } catch (error) {
    console.error('[Students Error - Stats]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve system statistics.'
    });
  }
});

// --------------------------------------------------------------------
// 3. DELETE /api/students/:id (Delete Student Account - Admin Only)
// --------------------------------------------------------------------
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const studentId = parseInt(req.params.id, 10);

    if (isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID.'
      });
    }

    // Prevent deleting self or other admin accounts
    const [target] = await db.execute(
      'SELECT role FROM students WHERE id = ?',
      [studentId]
    );

    if (target.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.'
      });
    }

    if (target[0].role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Administrator accounts cannot be deleted through this endpoint.'
      });
    }

    await db.execute('DELETE FROM students WHERE id = ?', [studentId]);

    return res.status(200).json({
      success: true,
      message: 'Student account deleted successfully.'
    });
  } catch (error) {
    console.error('[Students Error - Delete]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete student account.'
    });
  }
});

module.exports = router;

