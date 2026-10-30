/**
 * ====================================================================
 * Client-Side Authentication Controller
 * File: public/js/auth.js
 * ====================================================================
 * Manages user login, student registration, demo credential auto-fill,
 * client-side validations, and redirection based on user role.
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is already logged in; if so, redirect immediately
  checkExistingSession();

  // Initialize Login Form if present on the page
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    initLoginForm();
  }

  // Initialize Registration Form if present on the page
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    initRegisterForm();
  }

  // Initialize Demo Credentials buttons
  initDemoButtons();
});

/**
 * Checks if active session exists.
 * If logged in, automatically redirects to the relevant dashboard.
 */
function checkExistingSession() {
  fetch('/api/auth/me')
    .then(res => res.json())
    .then(data => {
      if (data.authenticated && data.user) {
        if (data.user.role === 'admin') {
          window.location.href = '/admin.html';
        } else {
          window.location.href = '/dashboard.html';
        }
      }
    })
    .catch(() => {
      // Unauthenticated - stay on auth page
    });
}

/**
 * Handles Student & Admin Login Form Submission
 */
function initLoginForm() {
  const form = document.getElementById('loginForm');
  const alertBox = document.getElementById('alertBox');
  const loginBtn = document.getElementById('loginBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert(alertBox);

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showAlert(alertBox, 'Please enter both your college email and password.', 'danger');
      return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = 'Verifying credentials...';

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showAlert(alertBox, `${result.message} Redirecting...`, 'success');
        setTimeout(() => {
          window.location.href = result.redirectTo || '/dashboard.html';
        }, 600);
      } else {
        showAlert(alertBox, result.message || 'Invalid email or password.', 'danger');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Sign In to Portal';
      }
    } catch (err) {
      console.error('Login error:', err);
      showAlert(alertBox, 'Unable to connect to server. Please check your network and MySQL status.', 'danger');
      loginBtn.disabled = false;
      loginBtn.textContent = 'Sign In to Portal';
    }
  });
}

/**
 * Handles Student Registration Form Submission
 */
function initRegisterForm() {
  const form = document.getElementById('registerForm');
  const alertBox = document.getElementById('alertBox');
  const registerBtn = document.getElementById('registerBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert(alertBox);

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const branch = document.getElementById('regBranch').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (!name || !email || !branch || !password) {
      showAlert(alertBox, 'Please fill in all required fields.', 'danger');
      return;
    }

    if (password.length < 6) {
      showAlert(alertBox, 'Password must be at least 6 characters long.', 'danger');
      return;
    }

    if (password !== confirmPassword) {
      showAlert(alertBox, 'Passwords do not match. Please re-enter carefully.', 'danger');
      return;
    }

    registerBtn.disabled = true;
    registerBtn.textContent = 'Creating account...';

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, branch, password })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showAlert(alertBox, `${result.message} Redirecting to your dashboard...`, 'success');
        setTimeout(() => {
          window.location.href = result.redirectTo || '/dashboard.html';
        }, 800);
      } else {
        showAlert(alertBox, result.message || 'Registration failed.', 'danger');
        registerBtn.disabled = false;
        registerBtn.textContent = 'Create Student Account';
      }
    } catch (err) {
      console.error('Registration error:', err);
      showAlert(alertBox, 'Unable to connect to server. Please check your network and MySQL status.', 'danger');
      registerBtn.disabled = false;
      registerBtn.textContent = 'Create Student Account';
    }
  });
}

/**
 * Demo Credentials Auto-Fill Buttons for Viva / Project Testing
 */
function initDemoButtons() {
  const fillStudentBtn = document.getElementById('fillStudentBtn');
  const fillAdminBtn = document.getElementById('fillAdminBtn');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (fillStudentBtn && emailInput && passwordInput) {
    fillStudentBtn.addEventListener('click', () => {
      emailInput.value = 'rahul.sharma@collegehub.com';
      passwordInput.value = 'student123';
    });
  }

  if (fillAdminBtn && emailInput && passwordInput) {
    fillAdminBtn.addEventListener('click', () => {
      emailInput.value = 'admin@collegehub.com';
      passwordInput.value = 'admin123';
    });
  }
}

/**
 * Utility: Show alert message banner
 */
function showAlert(element, message, type = 'danger') {
  if (!element) return;
  element.className = `alert alert-${type}`;
  element.textContent = message;
  element.style.display = 'block';
}

/**
 * Utility: Hide alert message banner
 */
function hideAlert(element) {
  if (!element) return;
  element.style.display = 'none';
  element.textContent = '';
}

