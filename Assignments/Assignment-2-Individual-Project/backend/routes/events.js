/**
 * ====================================================================
 * College Events Management Routes
 * File: routes/events.js
 * ====================================================================
 * Endpoints:
 *   GET    /api/events      -> List upcoming college events (Authenticated)
 *   POST   /api/events      -> Create a new college event (Admin only)
 *   PUT    /api/events/:id  -> Update an event (Admin only)
 *   DELETE /api/events/:id  -> Delete an event (Admin only)
 * ====================================================================
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

// --------------------------------------------------------------------
// 1. GET /api/events (Fetch Events - Authenticated)
// --------------------------------------------------------------------
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const [events] = await db.execute(`
      SELECT id, title, description, event_date, event_time, venue, created_at
      FROM events
      ORDER BY event_date ASC
    `);

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('[Events Error - Fetch]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve college events.'
    });
  }
});

// --------------------------------------------------------------------
// 2. POST /api/events (Create Event - Admin Only)
// --------------------------------------------------------------------
router.post('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, description, event_date, event_time, venue } = req.body;

    if (!title || !description || !event_date || !venue) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, date, and venue are required fields.'
      });
    }

    const time = event_time && event_time.trim() ? event_time.trim() : '10:00 AM';

    const [result] = await db.execute(
      'INSERT INTO events (title, description, event_date, event_time, venue) VALUES (?, ?, ?, ?, ?)',
      [title.trim(), description.trim(), event_date, time, venue.trim()]
    );

    return res.status(201).json({
      success: true,
      message: 'College event added successfully.',
      eventId: result.insertId
    });
  } catch (error) {
    console.error('[Events Error - Create]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating event.'
    });
  }
});

// --------------------------------------------------------------------
// 3. PUT /api/events/:id (Update Event - Admin Only)
// --------------------------------------------------------------------
router.put('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const { title, description, event_date, event_time, venue } = req.body;

    if (isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID.'
      });
    }

    if (!title || !description || !event_date || !venue) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, date, and venue are required.'
      });
    }

    const time = event_time && event_time.trim() ? event_time.trim() : '10:00 AM';

    const [result] = await db.execute(
      'UPDATE events SET title = ?, description = ?, event_date = ?, event_time = ?, venue = ? WHERE id = ?',
      [title.trim(), description.trim(), event_date, time, venue.trim(), eventId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully.'
    });
  } catch (error) {
    console.error('[Events Error - Update]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update event.'
    });
  }
});

// --------------------------------------------------------------------
// 4. DELETE /api/events/:id (Delete Event - Admin Only)
// --------------------------------------------------------------------
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);

    if (isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID.'
      });
    }

    const [result] = await db.execute(
      'DELETE FROM events WHERE id = ?',
      [eventId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully.'
    });
  } catch (error) {
    console.error('[Events Error - Delete]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete event.'
    });
  }
});

module.exports = router;

