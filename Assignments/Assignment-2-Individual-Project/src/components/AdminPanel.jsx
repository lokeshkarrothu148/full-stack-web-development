import React, { useState } from 'react';

export default function AdminPanel({
  students,
  materials,
  assignments,
  announcements,
  events,
  feedbacks,
  onAddMaterial,
  onDeleteMaterial,
  onAddAssignment,
  onDeleteAssignment,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onAddEvent,
  onDeleteEvent,
  onToggleFeedbackStatus,
  onDeleteFeedback,
  onDeleteStudent
}) {
  const [adminTab, setAdminTab] = useState('materials');

  // Form States
  const [matTitle, setMatTitle] = useState('');
  const [matSubject, setMatSubject] = useState('Computer Science');
  const [matDesc, setMatDesc] = useState('');
  const [matUrl, setMatUrl] = useState('');

  const [assignTitle, setAssignTitle] = useState('');
  const [assignSubject, setAssignSubject] = useState('Computer Science');
  const [assignDeadline, setAssignDeadline] = useState('');
  const [assignDesc, setAssignDesc] = useState('');

  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState('General');
  const [annContent, setAnnContent] = useState('');

  const [evtTitle, setEvtTitle] = useState('');
  const [evtDate, setEvtDate] = useState('');
  const [evtTime, setEvtTime] = useState('10:00 AM');
  const [evtVenue, setEvtVenue] = useState('');
  const [evtDesc, setEvtDesc] = useState('');

  const [actionAlert, setActionAlert] = useState(null);

  const triggerAlert = (msg) => {
    setActionAlert(msg);
    setTimeout(() => setActionAlert(null), 3000);
  };

  const handleAddMaterial = (e) => {
    e.preventDefault();
    if (!matTitle.trim()) return;
    onAddMaterial({
      title: matTitle.trim(),
      subject: matSubject,
      description: matDesc.trim(),
      file_path: matUrl.trim() || 'https://www.cs.bham.ac.uk/~jxb/DSA/dsa.pdf',
      file_type: 'PDF Document',
      uploaded_by: 'Administrator',
      date: new Date().toISOString().split('T')[0]
    });
    setMatTitle('');
    setMatDesc('');
    setMatUrl('');
    triggerAlert('Study Material published successfully!');
  };

  const handleAddAssignment = (e) => {
    e.preventDefault();
    if (!assignTitle.trim() || !assignDeadline) return;
    onAddAssignment({
      title: assignTitle.trim(),
      subject: assignSubject,
      deadline: assignDeadline,
      description: assignDesc.trim(),
      created_by: 'Administrator'
    });
    setAssignTitle('');
    setAssignDeadline('');
    setAssignDesc('');
    triggerAlert('Assignment created successfully!');
  };

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    onAddAnnouncement({
      title: annTitle.trim(),
      category: annCategory,
      content: annContent.trim(),
      published_by: 'Academic Office',
      date: new Date().toISOString().split('T')[0]
    });
    setAnnTitle('');
    setAnnContent('');
    triggerAlert('Notice published successfully!');
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!evtTitle.trim() || !evtDate || !evtVenue.trim()) return;
    onAddEvent({
      title: evtTitle.trim(),
      event_date: evtDate,
      event_time: evtTime,
      venue: evtVenue.trim(),
      description: evtDesc.trim()
    });
    setEvtTitle('');
    setEvtDate('');
    setEvtVenue('');
    setEvtDesc('');
    triggerAlert('Campus Event scheduled successfully!');
  };

  return (
    <div className="main-container">
      {actionAlert && <div className="alert alert-success">{actionAlert}</div>}

      <div className="section-header">
        <h2>Administrator Control Center</h2>
        <p>Manage curriculum materials, coursework, notices, events, and student inquiries</p>
      </div>

      {/* Analytics Counter Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{students.length}</div>
          <div className="stat-label">Enrolled Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{materials.length}</div>
          <div className="stat-label">Study Materials</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{assignments.length}</div>
          <div className="stat-label">Active Assignments</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{announcements.length}</div>
          <div className="stat-label">Announcements</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{events.length}</div>
          <div className="stat-label">Campus Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{feedbacks.length}</div>
          <div className="stat-label">Student Queries</div>
        </div>
      </div>

      {/* Management Tabs */}
      <div className="tabs-nav">
        <button className={`tab-btn ${adminTab === 'materials' ? 'active' : ''}`} onClick={() => setAdminTab('materials')}>
          Manage Materials
        </button>
        <button className={`tab-btn ${adminTab === 'assignments' ? 'active' : ''}`} onClick={() => setAdminTab('assignments')}>
          Manage Assignments
        </button>
        <button className={`tab-btn ${adminTab === 'announcements' ? 'active' : ''}`} onClick={() => setAdminTab('announcements')}>
          Manage Notices
        </button>
        <button className={`tab-btn ${adminTab === 'events' ? 'active' : ''}`} onClick={() => setAdminTab('events')}>
          Manage Events
        </button>
        <button className={`tab-btn ${adminTab === 'feedback' ? 'active' : ''}`} onClick={() => setAdminTab('feedback')}>
          Review Feedback
        </button>
        <button className={`tab-btn ${adminTab === 'students' ? 'active' : ''}`} onClick={() => setAdminTab('students')}>
          Student Directory
        </button>
      </div>

      {/* TAB 1: MATERIALS */}
      {adminTab === 'materials' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '1rem' }}>Add New Study Material</h3>
            <form onSubmit={handleAddMaterial}>
              <div className="form-group">
                <label className="form-label">Material Title *</label>
                <input type="text" className="form-control" placeholder="e.g. Operating Systems Notes" value={matTitle} onChange={(e) => setMatTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Subject *</label>
                <select className="form-control" value={matSubject} onChange={(e) => setMatSubject(e.target.value)}>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">PDF Web URL</label>
                <input type="url" className="form-control" placeholder="https://example.com/notes.pdf" value={matUrl} onChange={(e) => setMatUrl(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="3" placeholder="Summary of topics..." value={matDesc} onChange={(e) => setMatDesc(e.target.value)}></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block">Publish Material</button>
            </form>
          </div>

          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '1rem' }}>Published Materials Catalog</h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((m) => (
                    <tr key={m.id}>
                      <td><strong>{m.title}</strong></td>
                      <td><span className="badge badge-primary">{m.subject}</span></td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => { onDeleteMaterial(m.id); triggerAlert('Material removed.'); }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ASSIGNMENTS */}
      {adminTab === 'assignments' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '1rem' }}>Create Assignment</h3>
            <form onSubmit={handleAddAssignment}>
              <div className="form-group">
                <label className="form-label">Assignment Title *</label>
                <input type="text" className="form-control" placeholder="e.g. Implement Red-Black Trees" value={assignTitle} onChange={(e) => setAssignTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Subject *</label>
                <input type="text" className="form-control" placeholder="e.g. Computer Science" value={assignSubject} onChange={(e) => setAssignSubject(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Deadline *</label>
                <input type="datetime-local" className="form-control" value={assignDeadline} onChange={(e) => setAssignDeadline(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Problem Statement</label>
                <textarea className="form-control" rows="3" placeholder="Submission instructions..." value={assignDesc} onChange={(e) => setAssignDesc(e.target.value)} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block">Publish Assignment</button>
            </form>
          </div>

          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '1rem' }}>Active Assignments</h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => (
                    <tr key={a.id}>
                      <td><strong>{a.title}</strong></td>
                      <td><span className="badge badge-primary">{a.subject}</span></td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => { onDeleteAssignment(a.id); triggerAlert('Assignment removed.'); }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ANNOUNCEMENTS */}
      {adminTab === 'announcements' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '1rem' }}>Publish Notice</h3>
            <form onSubmit={handleAddAnnouncement}>
              <div className="form-group">
                <label className="form-label">Notice Title *</label>
                <input type="text" className="form-control" placeholder="e.g. Mid-Semester Timetable" value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-control" value={annCategory} onChange={(e) => setAnnCategory(e.target.value)}>
                  <option value="General">General</option>
                  <option value="Exam">Exam</option>
                  <option value="Academic">Academic</option>
                  <option value="Holiday">Holiday</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notice Content *</label>
                <textarea className="form-control" rows="4" placeholder="Announcement details..." value={annContent} onChange={(e) => setAnnContent(e.target.value)} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block">Publish Notice</button>
            </form>
          </div>

          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '1rem' }}>Published Notices</h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.map((an) => (
                    <tr key={an.id}>
                      <td><strong>{an.title}</strong></td>
                      <td><span className="badge badge-warning">{an.category}</span></td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => { onDeleteAnnouncement(an.id); triggerAlert('Notice removed.'); }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EVENTS */}
      {adminTab === 'events' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '1rem' }}>Schedule College Event</h3>
            <form onSubmit={handleAddEvent}>
              <div className="form-group">
                <label className="form-label">Event Name *</label>
                <input type="text" className="form-control" placeholder="e.g. Annual Tech Symposium" value={evtTitle} onChange={(e) => setEvtTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input type="date" className="form-control" value={evtDate} onChange={(e) => setEvtDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <input type="text" className="form-control" placeholder="e.g. 10:00 AM" value={evtTime} onChange={(e) => setEvtTime(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Venue *</label>
                <input type="text" className="form-control" placeholder="e.g. Main Auditorium" value={evtVenue} onChange={(e) => setEvtVenue(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="3" placeholder="Brief about the event..." value={evtDesc} onChange={(e) => setEvtDesc(e.target.value)}></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block">Schedule Event</button>
            </form>
          </div>

          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '1rem' }}>Scheduled Events</h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => (
                    <tr key={ev.id}>
                      <td><strong>{ev.title}</strong></td>
                      <td>{ev.event_date}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => { onDeleteEvent(ev.id); triggerAlert('Event removed.'); }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STUDENT FEEDBACK */}
      {adminTab === 'feedback' && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Submitted Student Feedback & Inquiries</h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Department</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((fb) => (
                  <tr key={fb.id}>
                    <td>
                      <strong>{fb.student_name}</strong><br />
                      <small style={{ color: 'var(--text-muted)' }}>{fb.student_email}</small>
                    </td>
                    <td>{fb.student_branch}</td>
                    <td><strong>{fb.subject}</strong></td>
                    <td style={{ maxWidth: '240px', fontSize: '0.85rem' }}>{fb.message}</td>
                    <td>⭐ {fb.rating}/5</td>
                    <td>
                      <span className={`badge ${fb.status === 'reviewed' ? 'badge-success' : 'badge-warning'}`}>
                        {fb.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => { onToggleFeedbackStatus(fb.id); triggerAlert('Status updated.'); }}
                        >
                          {fb.status === 'reviewed' ? 'Mark Pending' : 'Mark Reviewed'}
                        </button>
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={() => { onDeleteFeedback(fb.id); triggerAlert('Feedback deleted.'); }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: STUDENT DIRECTORY */}
      {adminTab === 'students' && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Registered Student Directory</h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Branch</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr key={st.id}>
                    <td>#{st.id}</td>
                    <td><strong>{st.name}</strong></td>
                    <td>{st.email}</td>
                    <td>{st.branch}</td>
                    <td><span className={`badge ${st.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>{st.role}</span></td>
                    <td>
                      {st.role === 'admin' ? (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Protected</span>
                      ) : (
                        <button className="btn btn-danger btn-sm" onClick={() => { onDeleteStudent(st.id); triggerAlert('Student removed.'); }}>
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

