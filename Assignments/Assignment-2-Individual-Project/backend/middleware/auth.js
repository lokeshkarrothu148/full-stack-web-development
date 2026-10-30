/**
 * ====================================================================
 * Authentication Middleware
 * File: middleware/auth.js
 * ====================================================================
 * Verifies that an active, valid session exists for the incoming request.
 * If user is authenticated, execution continues to the next handler.
 * If unauthenticated:
 *   - For API requests: returns HTTP 401 Unauthorized JSON error.
 *   - For page navigations: redirects the client browser to /login.html.
 * ====================================================================
 */

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  // Check if request is an API call or expects JSON
  const isApiRequest =
    req.originalUrl.startsWith('/api/') ||
    req.xhr ||
    (req.headers.accept && req.headers.accept.includes('application/json'));

  if (isApiRequest) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in to access this resource.'
    });
  }

  // Redirect page browser requests to login
  return res.redirect('/login.html');
}

module.exports = {
  isAuthenticated
};

