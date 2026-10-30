/**
 * ====================================================================
 * Administrator Dashboard Controller
 * File: public/js/admin.js
 * ====================================================================
 * Enforces admin authorization, handles tab switching, loads analytics,
 * and executes CRUD operations for Materials, Assignments, Announcements,
 * Events, Feedback, and Student Accounts.
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminDashboard();
});

let currentAdminUser = null;

async function initAdminDashboard() {
  // 1. Strict Administrator Authorization Check
  try {
    const authRes = await fetch('/api/auth/me');
    const authData = await authRes.json();

    if (!authRes.ok || !authData.authenticated || !authData.user) {
      window.location.href = '/login.html';
      return;
    }

    if (authData.user.role !== 'admin') {
      alert('Access Denied: Administrator privileges are required to view this page.');
      window.location.href = '/dashboard.html';
      return;
    }

    currentAdminUser = authData.user;
    const adminUserBadge = document.getElementById('adminUserBadge');
    if (adminUserBadge) {
      adminUserBadge.textContent = `${currentAdminUser.name} (Admin)`;
    }
  } catch (err) {
    console.error('Admin authentication error:', err);
    window.location.href = '/login.html';
    return;
  }

  // 2. Setup Navigation & Tabs
  setupTabs();
  setupRadioToggles();
  setupLogout();

  // 3. Load Overview Analytics & Tab Data
  loadAdminStats();
  loadMaterialsList();
  loadAssignmentsList();
  loadAnnouncementsList();
  loadEventsList();
  loadFeedbackList();
  loadStudentsList();

  // 4. Setup Form Handlers
  setupAddMaterialForm();
  setupAddAssignmentForm();
  setupAddAnnouncementForm();
  setupAddEventForm();
}

/**
 * Tab Switching Implementation
 */
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

/**
 * Toggle File Upload vs URL input in Materials Form
 */
function setupRadioToggles() {
  const radioUpload = document.getElementById('radioUpload');
  const radioUrl = document.getElementById('radioUrl');
  const fileUploadGroup = document.getElementById('fileUploadGroup');
  const fileUrlGroup = document.getElementById('fileUrlGroup');

  if (radioUpload && radioUrl) {
    radioUpload.addEventListener('change', () => {
      fileUploadGroup.style.display = 'block';
      fileUrlGroup.style.display = 'none';
    });

    radioUrl.addEventListener('change', () => {
      fileUploadGroup.style.display = 'none';
      fileUrlGroup.style.display = 'block';
    });
  }
}

/**
 * Fetch and Populate System Statistics
 */
async function loadAdminStats() {
  try {
    const res = await fetch('/api/students/stats');
    const result = await res.json();

    if (res.ok && result.success) {
      const d = result.data;
      document.getElementById('statStudents').textContent = d.students;
      document.getElementById('statMaterials').textContent = d.materials;
      document.getElementById('statAssignments').textContent = d.assignments;
      document.getElementById('statAnnouncements').textContent = d.announcements;
      document.getElementById('statEvents').textContent = d.events;
      document.getElementById('statFeedback').textContent = d.feedback;
    }
  } catch (err) {
    console.error('Error loading stats:', err);
  }
}

/* ====================================================================
   1. MATERIALS MANAGEMENT
   ==================================================================== */
function setupAddMaterialForm() {
  const form = document.getElementById('addMaterialForm');
  const submitBtn = document.getElementById('addMaterialBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('matTitle').value.trim();
    const subject = document.getElementById('matSubject').value;
    const description = document.getElementById('matDescription').value.trim();
    const isUpload = document.getElementById('radioUpload').checked;
    const fileInput = document.getElementById('matFile');
    const urlInput = document.getElementById('matUrl').value.trim();

    if (!title || !subject) {
      showAdminAlert('Title and Subject are mandatory.', 'danger');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('description', description);

    if (isUpload) {
      if (!fileInput.files || fileInput.files.length === 0) {
        showAdminAlert('Please select a PDF file to upload.', 'danger');
        return;
      }
      formData.append('file_type', 'upload');
      formData.append('material_file', fileInput.files[0]);
    } else {
      if (!urlInput) {
        showAdminAlert('Please enter an external URL for the document.', 'danger');
        return;
      }
      formData.append('file_type', 'url');
      formData.append('file_url', urlInput);
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving material...';

    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showAdminAlert(data.message, 'success');
        form.reset();
        document.getElementById('radioUpload').checked = true;
        document.getElementById('fileUploadGroup').style.display = 'block';
        document.getElementById('fileUrlGroup').style.display = 'none';
        loadMaterialsList();
        loadAdminStats();
      } else {
        showAdminAlert(data.message || 'Failed to save material.', 'danger');
      }
    } catch (err) {
      console.error('Error saving material:', err);
      showAdminAlert('Network or server error while uploading material.', 'danger');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save Study Material';
    }
  });
}

async function loadMaterialsList() {
  const tbody = document.querySelector('#materialsTable tbody');
  try {
    const res = await fetch('/api/materials');
    const result = await res.json();

    if (res.ok && result.success && result.data.length > 0) {
      tbody.innerHTML = result.data.map(item => `
        <tr>
          <td><strong>${escapeHTML(item.title)}</strong></td>
          <td><span class="badge badge-primary">${escapeHTML(item.subject)}</span></td>
          <td>${item.file_type === 'upload' ? 'Uploaded PDF' : 'Web Link'}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteMaterial(${item.id})">Delete</button>
          </td>
        </tr>
      `).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No study materials added yet.</td></tr>';
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Error loading materials.</td></tr>';
  }
}

window.deleteMaterial = async function(id) {
  if (!confirm('Are you sure you want to delete this study material?')) return;
  try {
    const res = await fetch(`/api/materials/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok && data.success) {
      showAdminAlert(data.message, 'success');
      loadMaterialsList();
      loadAdminStats();
    } else {
      showAdminAlert(data.message || 'Failed to delete material.', 'danger');
    }
  } catch (err) {
    showAdminAlert('Error deleting material.', 'danger');
  }
};

/* ====================================================================
   2. ASSIGNMENTS MANAGEMENT
   ==================================================================== */
function setupAddAssignmentForm() {
  const form = document.getElementById('addAssignmentForm');
  const submitBtn = document.getElementById('addAssignmentBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('assignTitle').value.trim();
    const subject = document.getElementById('assignSubject').value.trim();
    const deadline = document.getElementById('assignDeadline').value;
    const description = document.getElementById('assignDescription').value.trim();

    if (!title || !subject || !deadline || !description) {
      showAdminAlert('All assignment fields are required.', 'danger');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Publishing...';

    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, subject, deadline, description })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showAdminAlert(data.message, 'success');
        form.reset();
        loadAssignmentsList();
        loadAdminStats();
      } else {
        showAdminAlert(data.message || 'Failed to create assignment.', 'danger');
      }
    } catch (err) {
      showAdminAlert('Error creating assignment.', 'danger');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Publish Assignment';
    }
  });
}

async function loadAssignmentsList() {
  const tbody = document.querySelector('#assignmentsTable tbody');
  try {
    const res = await fetch('/api/assignments');
    const result = await res.json();

    if (res.ok && result.success && result.data.length > 0) {
      tbody.innerHTML = result.data.map(item => {
        const d = new Date(item.deadline).toLocaleString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        return `
          <tr>
            <td><strong>${escapeHTML(item.title)}</strong></td>
            <td><span class="badge badge-primary">${escapeHTML(item.subject)}</span></td>
            <td>${d}</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="deleteAssignment(${item.id})">Delete</button>
            </td>
          </tr>
        `;
      }).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No assignments posted yet.</td></tr>';
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Error loading assignments.</td></tr>';
  }
}

window.deleteAssignment = async function(id) {
  if (!confirm('Are you sure you want to delete this assignment?')) return;
  try {
    const res = await fetch(`/api/assignments/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok && data.success) {
      showAdminAlert(data.message, 'success');
      loadAssignmentsList();
      loadAdminStats();
    } else {
      showAdminAlert(data.message || 'Failed to delete assignment.', 'danger');
    }
  } catch (err) {
    showAdminAlert('Error deleting assignment.', 'danger');
  }
};

/* ====================================================================
   3. ANNOUNCEMENTS MANAGEMENT
   ==================================================================== */
function setupAddAnnouncementForm() {
  const form = document.getElementById('addAnnouncementForm');
  const submitBtn = document.getElementById('addAnnouncementBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('annTitle').value.trim();
    const category = document.getElementById('annCategory').value;
    const content = document.getElementById('annContent').value.trim();

    if (!title || !content) {
      showAdminAlert('Title and content are required.', 'danger');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Publishing...';

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, content })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showAdminAlert(data.message, 'success');
        form.reset();
        loadAnnouncementsList();
        loadAdminStats();
      } else {
        showAdminAlert(data.message || 'Failed to publish announcement.', 'danger');
      }
    } catch (err) {
      showAdminAlert('Error publishing announcement.', 'danger');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Publish Notice';
    }
  });
}

async function loadAnnouncementsList() {
  const tbody = document.querySelector('#announcementsTable tbody');
  try {
    const res = await fetch('/api/announcements');
    const result = await res.json();

    if (res.ok && result.success && result.data.length > 0) {
      tbody.innerHTML = result.data.map(item => {
        const d = new Date(item.created_at).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        });
        return `
          <tr>
            <td><strong>${escapeHTML(item.title)}</strong></td>
            <td><span class="badge badge-warning">${escapeHTML(item.category)}</span></td>
            <td>${d}</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="deleteAnnouncement(${item.id})">Delete</button>
            </td>
          </tr>
        `;
      }).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No announcements published yet.</td></tr>';
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Error loading announcements.</td></tr>';
  }
}

window.deleteAnnouncement = async function(id) {
  if (!confirm('Are you sure you want to delete this notice?')) return;
  try {
    const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok && data.success) {
      showAdminAlert(data.message, 'success');
      loadAnnouncementsList();
      loadAdminStats();
    } else {
      showAdminAlert(data.message || 'Failed to delete announcement.', 'danger');
    }
  } catch (err) {
    showAdminAlert('Error deleting announcement.', 'danger');
  }
};

/* ====================================================================
   4. EVENTS MANAGEMENT
   ==================================================================== */
function setupAddEventForm() {
  const form = document.getElementById('addEventForm');
  const submitBtn = document.getElementById('addEventBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('evtTitle').value.trim();
    const event_date = document.getElementById('evtDate').value;
    const event_time = document.getElementById('evtTime').value.trim();
    const venue = document.getElementById('evtVenue').value.trim();
    const description = document.getElementById('evtDescription').value.trim();

    if (!title || !event_date || !venue || !description) {
      showAdminAlert('Please fill in title, date, venue, and description.', 'danger');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Scheduling...';

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, event_date, event_time, venue, description })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showAdminAlert(data.message, 'success');
        form.reset();
        loadEventsList();
        loadAdminStats();
      } else {
        showAdminAlert(data.message || 'Failed to schedule event.', 'danger');
      }
    } catch (err) {
      showAdminAlert('Error scheduling event.', 'danger');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Schedule Event';
    }
  });
}

async function loadEventsList() {
  const tbody = document.querySelector('#eventsTable tbody');
  try {
    const res = await fetch('/api/events');
    const result = await res.json();

    if (res.ok && result.success && result.data.length > 0) {
      tbody.innerHTML = result.data.map(item => {
        const d = new Date(item.event_date).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        });
        return `
          <tr>
            <td><strong>${escapeHTML(item.title)}</strong></td>
            <td>${d} (${escapeHTML(item.event_time || '10:00 AM')})</td>
            <td>${escapeHTML(item.venue)}</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="deleteEvent(${item.id})">Delete</button>
            </td>
          </tr>
        `;
      }).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No scheduled events found.</td></tr>';
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Error loading events.</td></tr>';
  }
}

window.deleteEvent = async function(id) {
  if (!confirm('Are you sure you want to delete this event?')) return;
  try {
    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok && data.success) {
      showAdminAlert(data.message, 'success');
      loadEventsList();
      loadAdminStats();
    } else {
      showAdminAlert(data.message || 'Failed to delete event.', 'danger');
    }
  } catch (err) {
    showAdminAlert('Error deleting event.', 'danger');
  }
};

/* ====================================================================
   5. FEEDBACK REVIEW MANAGEMENT
   ==================================================================== */
async function loadFeedbackList() {
  const tbody = document.querySelector('#feedbackTable tbody');
  try {
    const res = await fetch('/api/feedback');
    const result = await res.json();

    if (res.ok && result.success && result.data.length > 0) {
      tbody.innerHTML = result.data.map(item => {
        const isReviewed = item.status === 'reviewed';
        const badgeClass = isReviewed ? 'badge-success' : 'badge-warning';
        const toggleTarget = isReviewed ? 'pending' : 'reviewed';
        const toggleBtnLabel = isReviewed ? 'Mark Pending' : 'Mark Reviewed';

        return `
          <tr>
            <td>
              <strong>${escapeHTML(item.student_name)}</strong><br>
              <small style="color:var(--text-muted);">${escapeHTML(item.student_email)}</small>
            </td>
            <td>${escapeHTML(item.student_branch)}</td>
            <td><strong>${escapeHTML(item.subject)}</strong></td>
            <td style="max-width:280px; font-size:0.85rem;">${escapeHTML(item.message)}</td>
            <td>⭐ ${item.rating}/5</td>
            <td><span class="badge ${badgeClass}">${item.status.toUpperCase()}</span></td>
            <td>
              <div style="display:flex; gap:0.35rem;">
                <button class="btn btn-secondary btn-sm" onclick="toggleFeedbackStatus(${item.id}, '${toggleTarget}')">
                  ${toggleBtnLabel}
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteFeedback(${item.id})">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No student feedback submitted yet.</td></tr>';
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:red;">Error loading feedback.</td></tr>';
  }
}

window.toggleFeedbackStatus = async function(id, newStatus) {
  try {
    const res = await fetch(`/api/feedback/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showAdminAlert(data.message, 'success');
      loadFeedbackList();
    } else {
      showAdminAlert(data.message || 'Failed to update status.', 'danger');
    }
  } catch (err) {
    showAdminAlert('Error updating feedback status.', 'danger');
  }
};

window.deleteFeedback = async function(id) {
  if (!confirm('Are you sure you want to delete this feedback record?')) return;
  try {
    const res = await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok && data.success) {
      showAdminAlert(data.message, 'success');
      loadFeedbackList();
      loadAdminStats();
    } else {
      showAdminAlert(data.message || 'Failed to delete feedback.', 'danger');
    }
  } catch (err) {
    showAdminAlert('Error deleting feedback.', 'danger');
  }
};

/* ====================================================================
   6. REGISTERED STUDENTS DIRECTORY
   ==================================================================== */
async function loadStudentsList() {
  const tbody = document.querySelector('#studentsTable tbody');
  try {
    const res = await fetch('/api/students');
    const result = await res.json();

    if (res.ok && result.success && result.data.length > 0) {
      tbody.innerHTML = result.data.map(item => {
        const d = new Date(item.created_at).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        });
        const roleBadge = item.role === 'admin' 
          ? '<span class="badge badge-warning">ADMIN</span>' 
          : '<span class="badge badge-primary">STUDENT</span>';

        const deleteAction = item.role === 'admin'
          ? '<span style="color:var(--text-muted); font-size:0.8rem;">Protected</span>'
          : `<button class="btn btn-danger btn-sm" onclick="deleteStudent(${item.id})">Remove</button>`;

        return `
          <tr>
            <td>#${item.id}</td>
            <td><strong>${escapeHTML(item.name)}</strong></td>
            <td>${escapeHTML(item.email)}</td>
            <td>${escapeHTML(item.branch)}</td>
            <td>${roleBadge}</td>
            <td>${d}</td>
            <td>${deleteAction}</td>
          </tr>
        `;
      }).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No students registered yet.</td></tr>';
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:red;">Error loading students.</td></tr>';
  }
}

window.deleteStudent = async function(id) {
  if (!confirm('Are you sure you want to remove this student account? All related feedback records will also be deleted.')) {
    return;
  }
  try {
    const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok && data.success) {
      showAdminAlert(data.message, 'success');
      loadStudentsList();
      loadAdminStats();
    } else {
      showAdminAlert(data.message || 'Failed to delete student.', 'danger');
    }
  } catch (err) {
    showAdminAlert('Error deleting student account.', 'danger');
  }
};

/* ====================================================================
   GLOBAL LOGOUT & ALERT HELPERS
   ==================================================================== */
function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to log out from Administrator mode?')) return;
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      const data = await res.json();
      window.location.href = data.redirectTo || '/login.html';
    } catch (_) {
      window.location.href = '/login.html';
    }
  });
}

function showAdminAlert(message, type = 'success') {
  const alertBox = document.getElementById('adminAlert');
  if (!alertBox) return;
  alertBox.className = `alert alert-${type}`;
  alertBox.textContent = message;
  alertBox.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => {
    alertBox.style.display = 'none';
  }, 5000);
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

