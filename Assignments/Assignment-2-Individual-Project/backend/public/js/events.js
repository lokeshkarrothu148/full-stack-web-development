/**
 * ====================================================================
 * College Events Controller
 * File: public/js/events.js
 * ====================================================================
 * Fetches college events from MySQL and renders them with dates,
 * times, venues, and descriptions for students.
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initEventsPage();
});

async function initEventsPage() {
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

  // 3. Load Events
  loadEvents();
}

async function loadEvents() {
  const container = document.getElementById('eventsContainer');
  if (!container) return;

  try {
    const res = await fetch('/api/events');
    const result = await res.json();

    if (res.ok && result.success && result.data.length > 0) {
      container.innerHTML = result.data.map(item => {
        const eventDateObj = new Date(item.event_date);
        const formattedDate = eventDateObj.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        return `
          <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="card-header">
                <span class="badge badge-success">Event</span>
                <span class="badge badge-primary">${escapeHTML(item.event_time || '10:00 AM')}</span>
              </div>

              <h3 class="card-title" style="margin-bottom: 0.75rem; font-size: 1.25rem;">
                ${escapeHTML(item.title)}
              </h3>

              <p style="color: var(--text-main); font-size: 0.95rem; margin-bottom: 1.25rem; white-space: pre-line;">
                ${escapeHTML(item.description)}
              </p>
            </div>

            <div style="border-top: 1px solid var(--border-color); padding-top: 0.85rem; margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-muted);">
              <div style="margin-bottom: 0.35rem;">
                📅 <strong>Date:</strong> ${formattedDate}
              </div>
              <div>
                📍 <strong>Venue:</strong> ${escapeHTML(item.venue)}
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      container.innerHTML = `
        <div class="card" style="text-align: center; color: var(--text-muted); grid-column: 1 / -1; padding: 3rem;">
          <h3>No upcoming events scheduled</h3>
          <p style="margin-top: 0.5rem;">New events and workshops will appear here when announced.</p>
        </div>
      `;
    }
  } catch (err) {
    console.error('Error fetching events:', err);
    container.innerHTML = `
      <div class="card" style="text-align: center; color: var(--danger); grid-column: 1 / -1;">
        Failed to load college events. Please verify database connection.
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

