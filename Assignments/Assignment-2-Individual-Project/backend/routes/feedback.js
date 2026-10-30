/**
 * ====================================================================
 * Student Feedback Routes
 * File: routes/feedback.js
 * ====================================================================
 * Endpoints:
 *   POST   /api/feedback            -> Submit feedback (Authenticated Student)
 *   GET    /api/feedback            -> List all feedback with student details (Admin only)
 *   PATCH  /api/feedback/:id/status -> Update status e.g. 'reviewed' (Admin only)
 *   DELETE /api/feedback/:id        -> Delete feedback (Admin only)
 * ====================================================================
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

// --------------------------------------------------------------------
// 1. POST /api/feedback (Submit Student Feedback - Authenticated)
// --------------------------------------------------------------------
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { subject, message, rating } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required.'
      });
    }

    const studentId = req.session.user.id;
    let numericRating = parseInt(rating, 10);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      numericRating = 5;
    }

    const [result] = await db.execute(
      'INSERT INTO feedback (student_id, subject, message, rating, status) VALUES (?, ?, ?, ?, ?)',
      [studentId, subject.trim(), message.trim(), numericRating, 'pending']
    );

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully. Thank you for helping improve CollegeHub!',
      feedbackId: result.insertId
    });
  } catch (error) {
    console.error('[Feedback Error - Submit]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit feedback. Please try again.'
    });
  }
});

// --------------------------------------------------------------------
// 2. GET /api/feedback (Retrieve All Feedback - Admin Only)
// --------------------------------------------------------------------
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    // Join feedback with students table to display student name, email, and branch
    const [feedbacks] = await db.execute(`
      SELECT f.id, f.student_id, f.subject, f.message, f.rating, f.status, f.created_at,
             s.name AS student_name, s.email AS student_email, s.branch AS student_branch
      FROM feedback f
      INNER JOIN students s ON f.student_id = s.id
      ORDER BY f.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    console.error('[Feedback Error - Fetch All]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve feedback records.'
    });
  }
});

// --------------------------------------------------------------------
// 3. PATCH /api/feedback/:id/status (Update Review Status - Admin Only)
// --------------------------------------------------------------------
router.patch('/:id/status', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const feedbackId = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (isNaN(feedbackId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid feedback ID.'
      });
    }

    const validStatuses = ['pending', 'reviewed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'pending' or 'reviewed'."
      });
    }

    const [result] = await db.execute(
      'UPDATE feedback SET status = ? WHERE id = ?',
      [status, feedbackId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Feedback record not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Feedback status marked as "${status}".`
    });
  } catch (error) {
    console.error('[Feedback Error - Update Status]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update feedback status.'
    });
  }
});

// --------------------------------------------------------------------
// 4. DELETE /api/feedback/:id (Delete Feedback - Admin Only)
// --------------------------------------------------------------------
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const feedbackId = parseInt(req.params.id, 10);

    if (isNaN(feedbackId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid feedback ID.'
      });
    }

    const [result] = await db.execute(
      'DELETE FROM feedback WHERE id = ?',
      [feedbackId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Feedback record not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback record deleted successfully.'
    });
  } catch (error) {
    console.error('[Feedback Error - Delete]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete feedback record.'
    });
  }
});

module.exports = router;

