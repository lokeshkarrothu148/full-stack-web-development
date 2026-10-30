/**
 * ====================================================================
 * Study Materials Controller
 * File: public/js/materials.js
 * ====================================================================
 * Fetches academic notes, handles live search and subject filtering,
 * and allows students to open or download PDF documents.
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initMaterialsPage();
});

async function initMaterialsPage() {
  // 1. Session check
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

  // 3. Setup filters
  const applyBtn = document.getElementById('applyFilterBtn');
  const searchInput = document.getElementById('searchInput');
  const subjectFilter = document.getElementById('subjectFilter');

  if (applyBtn) {
    applyBtn.addEventListener('click', loadMaterials);
  }

  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') loadMaterials();
    });
  }

  if (subjectFilter) {
    subjectFilter.addEventListener('change', loadMaterials);
  }

  // 4. Initial load
  loadMaterials();
}

async function loadMaterials() {
  const grid = document.getElementById('materialsGrid');
  const search = document.getElementById('searchInput').value.trim();
  const subject = document.getElementById('subjectFilter').value;

  grid.innerHTML = `
    <div class="card" style="text-align: center; color: var(--text-muted); grid-column: 1 / -1;">
      Loading study materials...
    </div>
  `;

  try {
    let url = `/api/materials?subject=${encodeURIComponent(subject)}&search=${encodeURIComponent(search)}`;
    const res = await fetch(url);
    const result = await res.json();

    if (res.ok && result.success && result.data.length > 0) {
      grid.innerHTML = result.data.map(item => {
        const dateFormatted = new Date(item.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        const isUpload = item.file_type === 'upload';
        const fileBadge = isUpload ? 'Uploaded PDF' : 'External Link';

        return `
          <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="card-header">
                <span class="badge badge-primary">${escapeHTML(item.subject)}</span>
                <span class="badge badge-warning" style="font-size: 0.7rem;">${fileBadge}</span>
              </div>
              <h3 class="card-title" style="margin-bottom: 0.65rem; font-size: 1.15rem;">
                ${escapeHTML(item.title)}
              </h3>
              <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem;">
                ${escapeHTML(item.description || 'No additional description provided.')}
              </p>
            </div>

            <div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.85rem;">
                Added: ${dateFormatted}
              </div>
              <a 
                href="${escapeHTML(item.file_path)}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn btn-outline btn-block"
              >
                Open / Download Material
              </a>
            </div>
          </div>
        `;
      }).join('');
    } else {
      grid.innerHTML = `
        <div class="card" style="text-align: center; color: var(--text-muted); grid-column: 1 / -1; padding: 3rem;">
          <h3>No study materials found</h3>
          <p style="margin-top: 0.5rem;">Try adjusting your keyword search or subject filter.</p>
        </div>
      `;
    }
  } catch (err) {
    console.error('Error fetching materials:', err);
    grid.innerHTML = `
      <div class="card" style="text-align: center; color: var(--danger); grid-column: 1 / -1;">
        Failed to fetch materials from the database. Please try again.
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

