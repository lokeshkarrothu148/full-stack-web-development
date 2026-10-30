/**
 * ====================================================================
 * Study Materials Routes
 * File: routes/materials.js
 * ====================================================================
 * Endpoints:
 *   GET    /api/materials       -> Fetch all study materials (Authenticated)
 *   POST   /api/materials       -> Add study material (Admin only, upload or URL)
 *   DELETE /api/materials/:id   -> Delete study material (Admin only)
 * ====================================================================
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

// Ensure uploads directory exists
const uploadDirectory = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configure Multer storage for secure PDF file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    // Generate safe, collision-resistant filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `material-${uniqueSuffix}-${sanitizedOriginalName}`);
  }
});

// Security: Validate file type and extension (PDF only)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.mimetype === 'application/pdf' && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF documents (.pdf) are allowed for upload.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB maximum size limit
  fileFilter: fileFilter
});

// --------------------------------------------------------------------
// 1. GET /api/materials (List All Study Materials - Authenticated)
// --------------------------------------------------------------------
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const { subject, search } = req.query;
    let query = `
      SELECT m.id, m.title, m.subject, m.description, m.file_path, m.file_type, 
             m.created_at, s.name AS uploaded_by_name
      FROM materials m
      LEFT JOIN students s ON m.uploaded_by = s.id
      WHERE 1=1
    `;
    const params = [];

    if (subject && subject.trim() !== '' && subject.trim().toLowerCase() !== 'all') {
      query += ' AND m.subject = ?';
      params.push(subject.trim());
    }

    if (search && search.trim() !== '') {
      query += ' AND (m.title LIKE ? OR m.description LIKE ?)';
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    query += ' ORDER BY m.created_at DESC';

    const [materials] = await db.execute(query, params);

    return res.status(200).json({
      success: true,
      count: materials.length,
      data: materials
    });
  } catch (error) {
    console.error('[Materials Error - Fetch]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve study materials.'
    });
  }
});

// --------------------------------------------------------------------
// 2. POST /api/materials (Add Study Material - Admin Only)
// --------------------------------------------------------------------
router.post('/', isAuthenticated, isAdmin, (req, res) => {
  upload.single('material_file')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    try {
      const { title, subject, description, file_type, file_url } = req.body;

      if (!title || !subject) {
        return res.status(400).json({
          success: false,
          message: 'Title and Subject are mandatory fields.'
        });
      }

      let filePath = '';
      let chosenType = file_type || 'url';

      if (req.file) {
        chosenType = 'upload';
        // Provide relative public path for serving
        filePath = `/uploads/${req.file.filename}`;
      } else if (file_url && file_url.trim() !== '') {
        chosenType = 'url';
        filePath = file_url.trim();

        // Basic URL validation
        try {
          new URL(filePath);
        } catch (_) {
          return res.status(400).json({
            success: false,
            message: 'Please provide a valid URL for the material link.'
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: 'Please either upload a PDF file or provide a valid PDF link/URL.'
        });
      }

      const adminId = req.session.user.id;

      const [result] = await db.execute(
        'INSERT INTO materials (title, subject, description, file_path, file_type, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)',
        [title.trim(), subject.trim(), (description || '').trim(), filePath, chosenType, adminId]
      );

      return res.status(201).json({
        success: true,
        message: 'Study material added successfully.',
        materialId: result.insertId
      });
    } catch (error) {
      console.error('[Materials Error - Add]:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while adding study material.'
      });
    }
  });
});

// --------------------------------------------------------------------
// 3. DELETE /api/materials/:id (Delete Material - Admin Only)
// --------------------------------------------------------------------
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const materialId = parseInt(req.params.id, 10);

    if (isNaN(materialId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid material ID.'
      });
    }

    // Retrieve file info to remove local upload if applicable
    const [rows] = await db.execute(
      'SELECT file_path, file_type FROM materials WHERE id = ?',
      [materialId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Study material not found.'
      });
    }

    const item = rows[0];

    // If locally uploaded, remove physical file from disk
    if (item.file_type === 'upload' && item.file_path.startsWith('/uploads/')) {
      const diskPath = path.join(__dirname, '..', item.file_path);
      if (fs.existsSync(diskPath)) {
        try {
          fs.unlinkSync(diskPath);
        } catch (unlinkErr) {
          console.warn('[Materials Warning]: Could not unlink file:', diskPath, unlinkErr.message);
        }
      }
    }

    await db.execute('DELETE FROM materials WHERE id = ?', [materialId]);

    return res.status(200).json({
      success: true,
      message: 'Study material deleted successfully.'
    });
  } catch (error) {
    console.error('[Materials Error - Delete]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete study material.'
    });
  }
});

module.exports = router;

