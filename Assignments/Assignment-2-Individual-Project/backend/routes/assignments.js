/**
 * ====================================================================
 * Assignments Management Routes
 * File: routes/assignments.js
 * ====================================================================
 * Endpoints:
 *   GET    /api/assignments      -> List all assignments (Authenticated)
 *   POST   /api/assignments      -> Create an assignment (Admin only)
 *   PUT    /api/assignments/:id  -> Edit an assignment (Admin only)
 *   DELETE /api/assignments/:id  -> Delete an assignment (Admin only)
 * ====================================================================
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

// --------------------------------------------------------------------
// 1. GET /api/assignments (Fetch All Assignments - Authenticated)
// --------------------------------------------------------------------
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const [assignments] = await db.execute(`
      SELECT a.id, a.title, a.subject, a.description, a.deadline, a.created_at,
             s.name AS created_by_name
      FROM assignments a
      LEFT JOIN students s ON a.created_by = s.id
      ORDER BY a.deadline ASC
    `);

    return res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    console.error('[Assignments Error - Fetch]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve assignments.'
    });
  }
});

// --------------------------------------------------------------------
// 2. POST /api/assignments (Create Assignment - Admin Only)
// --------------------------------------------------------------------
router.post('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, subject, description, deadline } = req.body;

    if (!title || !subject || !description || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'All fields (title, subject, description, deadline) are required.'
      });
    }

    const parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid deadline date and time.'
      });
    }

    const adminId = req.session.user.id;

    const [result] = await db.execute(
      'INSERT INTO assignments (title, subject, description, deadline, created_by) VALUES (?, ?, ?, ?, ?)',
      [title.trim(), subject.trim(), description.trim(), parsedDeadline, adminId]
    );

    return res.status(201).json({
      success: true,
      message: 'Assignment created successfully.',
      assignmentId: result.insertId
    });
  } catch (error) {
    console.error('[Assignments Error - Create]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating assignment.'
    });
  }
});

// --------------------------------------------------------------------
// 3. PUT /api/assignments/:id (Update Assignment - Admin Only)
// --------------------------------------------------------------------
router.put('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.id, 10);
    const { title, subject, description, deadline } = req.body;

    if (isNaN(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid assignment ID.'
      });
    }

    if (!title || !subject || !description || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'All fields (title, subject, description, deadline) are required.'
      });
    }

    const parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid deadline date and time.'
      });
    }

    const [result] = await db.execute(
      'UPDATE assignments SET title = ?, subject = ?, description = ?, deadline = ? WHERE id = ?',
      [title.trim(), subject.trim(), description.trim(), parsedDeadline, assignmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Assignment updated successfully.'
    });
  } catch (error) {
    console.error('[Assignments Error - Update]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update assignment.'
    });
  }
});

// --------------------------------------------------------------------
// 4. DELETE /api/assignments/:id (Delete Assignment - Admin Only)
// --------------------------------------------------------------------
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.id, 10);

    if (isNaN(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid assignment ID.'
      });
    }

    const [result] = await db.execute(
      'DELETE FROM assignments WHERE id = ?',
      [assignmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully.'
    });
  } catch (error) {
    console.error('[Assignments Error - Delete]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete assignment.'
    });
  }
});

module.exports = router;

