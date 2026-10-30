/**
 * ====================================================================
 * Student Dashboard Controller
 * File: public/js/dashboard.js
 * ====================================================================
 * Authenticates active session, displays student profile, loads recent
 * college announcements, handles student feedback submissions, and manages logout.
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initStudentDashboard();
});

let currentUser = null;

async function initStudentDashboard() {
  // 1. Verify Active Session
  try {
    const authRes = await fetch('/api/auth/me');
    const authData = await authRes.json();

    if (!authRes.ok || !authData.authenticated || !authData.user) {
      window.location.href = '/login.html';
      return;
    }

    currentUser = authData.user;
    renderStudentProfile(currentUser);
  } catch (err) {
    console.error('Session authentication error:', err);
    window.location.href = '/login.html';
    return;
  }

  // 2. Setup Logout Event Listener
  setupLogout();

  // 3. Load Recent Announcements
  loadRecentAnnouncements();

  // 4. Setup Feedback Form
  setupFeedbackForm();
}

/**
 * Renders user details in the header & profile card
 */
function renderStudentProfile(user) {
  const welcomeName = document.getElementById('welcomeName');
  const studentBranch = document.getElementById('studentBranch');
  const studentEmail = document.getElementById('studentEmail');
  const roleBadge = document.getElementById('roleBadge');
  const navUserBadge = document.getElementById('navUserBadge');

  if (welcomeName) welcomeName.textContent = `Welcome, ${user.name}!`;
  if (studentBranch) studentBranch.textContent = user.branch || 'General';
  if (studentEmail) studentEmail.textContent = user.email;
  if (roleBadge) {
    roleBadge.textContent = `Role: ${user.role.toUpperCase()}`;
    if (user.role === 'admin') {
      roleBadge.className = 'badge badge-warning';
    }
  }
  if (navUserBadge) {
    navUserBadge.textContent = `${user.name} (${user.role})`;
  }
}

/**
 * Fetches and displays recent campus announcements
 */
async function loadRecentAnnouncements() {
  const container = document.getElementById('announcementsContainer');
  if (!container) return;

  try {
    const res = await fetch('/api/announcements?limit=5');
    const result = await res.json();

    if (res.ok && result.success && result.data.length > 0) {
      container.innerHTML = result.data.map(item => {
        const formattedDate = new Date(item.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        let categoryBadgeClass = 'badge-primary';
        if (item.category === 'Exam') categoryBadgeClass = 'badge-danger';
        if (item.category === 'Academic') categoryBadgeClass = 'badge-warning';

        return `
          <div class="card" style="margin-bottom: 1rem;">
            <div class="card-header" style="margin-bottom: 0.5rem;">
              <h4 style="font-size: 1.05rem; font-weight: 700;">${escapeHTML(item.title)}</h4>
              <span class="badge ${categoryBadgeClass}">${escapeHTML(item.category || 'General')}</span>
            </div>
            <p style="color: var(--text-main); font-size: 0.95rem; margin-bottom: 0.75rem; white-space: pre-line;">
              ${escapeHTML(item.content)}
            </p>
            <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; justify-content: space-between;">
              <span>Posted by: ${escapeHTML(item.published_by_name || 'Administration')}</span>
              <span>${formattedDate}</span>
            </div>
          </div>
        `;
      }).join('');
    } else {
      container.innerHTML = `
        <div class="card" style="text-align: center; color: var(--text-muted);">
          No current announcements at this time.
        </div>
      `;
    }
  } catch (err) {
    console.error('Error loading announcements:', err);
    container.innerHTML = `
      <div class="card" style="text-align: center; color: var(--danger);">
        Failed to load announcements. Please refresh.
      </div>
    `;
  }
}

/**
 * Handles Student Feedback Submission
 */
function setupFeedbackForm() {
  const form = document.getElementById('feedbackForm');
  const alertBox = document.getElementById('feedbackAlert');
  const submitBtn = document.getElementById('feedbackSubmitBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const subject = document.getElementById('feedbackSubject').value.trim();
    const rating = document.getElementById('feedbackRating').value;
    const message = document.getElementById('feedbackMessage').value.trim();

    if (!subject || !message) {
      showDashboardAlert(alertBox, 'Please complete both subject and message.', 'danger');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subject, rating, message })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showDashboardAlert(alertBox, result.message, 'success');
        form.reset();
      } else {
        showDashboardAlert(alertBox, result.message || 'Submission failed.', 'danger');
      }
    } catch (err) {
      console.error('Feedback error:', err);
      showDashboardAlert(alertBox, 'Network error submitting feedback.', 'danger');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Feedback';
    }
  });
}

/**
 * Handles Session Logout
 */
function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to log out from CollegeHub?')) {
      return;
    }

    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      const data = await res.json();
      window.location.href = data.redirectTo || '/login.html';
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/login.html';
    }
  });
}

function showDashboardAlert(element, message, type = 'success') {
  if (!element) return;
  element.className = `alert alert-${type}`;
  element.textContent = message;
  element.style.display = 'block';
  setTimeout(() => {
    element.style.display = 'none';
  }, 5000);
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

