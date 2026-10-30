/**
 * ====================================================================
 * Assignments Controller
 * File: public/js/assignments.js
 * ====================================================================
 * Fetches course assignments from MySQL, calculates deadline countdowns,
 * and displays active coursework tasks for students.
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initAssignmentsPage();
});

async function initAssignmentsPage() {
  // 1. Session verification
  try {
    const authRes = await fetch('/api/auth/me');
    const authData = await authRes.json();

    if (!authRes.ok || !authData.authenticated || !authData.user) {
      window.location.href = '/login.html';
      return;
    }

    const navUserBadge = document.getElementById('navUserBadge');
    if (navUserBadge) {
      navUserBadge.textContent = `${authData.user.name} (${authData.user.role})`;
    }
  } catch (err) {
    window.location.href = '/login.html';
    return;
  }

  // 2. Setup logout
  setupLogout();

  // 3. Load Assignments
  loadAssignments();
}

async function loadAssignments() {
  const container = document.getElementById('assignmentsContainer');
  if (!container) return;

  try {
    const res = await fetch('/api/assignments');
    const result = await res.json();

    if (res.ok && result.success && result.data.length > 0) {
      container.innerHTML = result.data.map(item => {
        const deadlineDate = new Date(item.deadline);
        const now = new Date();
        const diffMs = deadlineDate - now;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        let statusBadge = '';
        if (diffMs < 0) {
          statusBadge = '<span class="badge badge-danger">Deadline Passed</span>';
        } else if (diffDays <= 2) {
          statusBadge = `<span class="badge badge-warning">Due in ${diffDays} day${diffDays === 1 ? '' : 's'}</span>`;
        } else {
          statusBadge = `<span class="badge badge-success">${diffDays} days remaining</span>`;
        }

        const formattedDeadline = deadlineDate.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        return `
          <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="card-header">
                <span class="badge badge-primary">${escapeHTML(item.subject)}</span>
                ${statusBadge}
              </div>

              <h3 class="card-title" style="margin-bottom: 0.75rem; font-size: 1.2rem;">
                ${escapeHTML(item.title)}
              </h3>

              <p style="color: var(--text-main); font-size: 0.95rem; margin-bottom: 1.25rem; white-space: pre-line;">
                ${escapeHTML(item.description)}
              </p>
            </div>

            <div style="border-top: 1px solid var(--border-color); padding-top: 0.85rem; margin-top: 0.5rem;">
              <div style="font-size: 0.85rem; color: var(--text-muted); display: flex; justify-content: space-between;">
                <span><strong>Deadline:</strong> ${formattedDeadline}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      container.innerHTML = `
        <div class="card" style="text-align: center; color: var(--text-muted); grid-column: 1 / -1; padding: 3rem;">
          <h3>No assignments found</h3>
          <p style="margin-top: 0.5rem;">Check back later for newly assigned coursework tasks.</p>
        </div>
      `;
    }
  } catch (err) {
    console.error('Error fetching assignments:', err);
    container.innerHTML = `
      <div class="card" style="text-align: center; color: var(--danger); grid-column: 1 / -1;">
        Failed to load assignments. Please check database connection.
      </div>
    `;
  }
}

function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to log out?')) return;
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      const data = await res.json();
      window.location.href = data.redirectTo || '/login.html';
    } catch (_) {
      window.location.href = '/login.html';
    }
  });
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

