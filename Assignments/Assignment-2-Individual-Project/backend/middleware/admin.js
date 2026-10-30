/**
 * ====================================================================
 * Administrator Authorization Middleware
 * File: middleware/admin.js
 * ====================================================================
 * Verifies that the currently logged-in user possesses the 'admin' role.
 * Ensures students cannot perform administrative operations (create assignments,
 * upload materials, post announcements, add events, review feedback).
 * ====================================================================
 */

function isAdmin(req, res, next) {
  if (!req.session || !req.session.user) {
    const isApiRequest =
      req.originalUrl.startsWith('/api/') ||
      req.xhr ||
      (req.headers.accept && req.headers.accept.includes('application/json'));

    if (isApiRequest) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.'
      });
    }
    return res.redirect('/login.html');
  }

  // Check role authorization
  if (req.session.user.role === 'admin') {
    return next();
  }

  // User is authenticated but NOT an administrator
  const isApiRequest =
    req.originalUrl.startsWith('/api/') ||
    req.xhr ||
    (req.headers.accept && req.headers.accept.includes('application/json'));

  if (isApiRequest) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Administrator privileges are required to perform this action.'
    });
  }

  // Redirect unauthorized student away from admin views
  return res.redirect('/dashboard.html');
}

module.exports = {
  isAdmin
};

