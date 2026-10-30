/**
 * ====================================================================
 * Announcements Management Routes
 * File: routes/announcements.js
 * ====================================================================
 * Endpoints:
 *   GET    /api/announcements      -> List recent announcements (Public/Auth)
 *   POST   /api/announcements      -> Publish an announcement (Admin only)
 *   PUT    /api/announcements/:id  -> Edit an announcement (Admin only)
 *   DELETE /api/announcements/:id  -> Delete an announcement (Admin only)
 * ====================================================================
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

// --------------------------------------------------------------------
// 1. GET /api/announcements (Fetch Announcements)
// --------------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;

    const [announcements] = await db.execute(`
      SELECT a.id, a.title, a.content, a.category, a.created_at,
             s.name AS published_by_name
      FROM announcements a
      LEFT JOIN students s ON a.published_by = s.id
      ORDER BY a.created_at DESC
      LIMIT ?
    `, [String(limit)]);

    return res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  } catch (error) {
    console.error('[Announcements Error - Fetch]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve announcements.'
    });
  }
});

// --------------------------------------------------------------------
// 2. POST /api/announcements (Publish Announcement - Admin Only)
// --------------------------------------------------------------------
router.post('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and Content are required fields.'
      });
    }

    const adminId = req.session.user.id;
    const finalCategory = (category && category.trim()) || 'General';

    const [result] = await db.execute(
      'INSERT INTO announcements (title, content, category, published_by) VALUES (?, ?, ?, ?)',
      [title.trim(), content.trim(), finalCategory, adminId]
    );

    return res.status(201).json({
      success: true,
      message: 'Announcement published successfully.',
      announcementId: result.insertId
    });
  } catch (error) {
    console.error('[Announcements Error - Publish]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while publishing announcement.'
    });
  }
});

// --------------------------------------------------------------------
// 3. PUT /api/announcements/:id (Update Announcement - Admin Only)
// --------------------------------------------------------------------
router.put('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const announcementId = parseInt(req.params.id, 10);
    const { title, content, category } = req.body;

    if (isNaN(announcementId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid announcement ID.'
      });
    }

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and Content are required.'
      });
    }

    const finalCategory = (category && category.trim()) || 'General';

    const [result] = await db.execute(
      'UPDATE announcements SET title = ?, content = ?, category = ? WHERE id = ?',
      [title.trim(), content.trim(), finalCategory, announcementId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Announcement updated successfully.'
    });
  } catch (error) {
    console.error('[Announcements Error - Update]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update announcement.'
    });
  }
});

// --------------------------------------------------------------------
// 4. DELETE /api/announcements/:id (Delete Announcement - Admin Only)
// --------------------------------------------------------------------
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const announcementId = parseInt(req.params.id, 10);

    if (isNaN(announcementId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid announcement ID.'
      });
    }

    const [result] = await db.execute(
      'DELETE FROM announcements WHERE id = ?',
      [announcementId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully.'
    });
  } catch (error) {
    console.error('[Announcements Error - Delete]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete announcement.'
    });
  }
});

module.exports = router;

