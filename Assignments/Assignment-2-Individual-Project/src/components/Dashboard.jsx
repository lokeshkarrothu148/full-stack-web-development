import React, { useState } from 'react';

export default function Dashboard({ currentUser, announcements, onNavigate, onSubmitFeedback }) {
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackRating, setFeedbackRating] = useState('5');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [alertMsg, setAlertMsg] = useState(null);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackSubject.trim() || !feedbackMessage.trim()) return;

    onSubmitFeedback({
      subject: feedbackSubject.trim(),
      rating: parseInt(feedbackRating, 10),
      message: feedbackMessage.trim()
    });

    setAlertMsg('Your feedback has been submitted successfully to the administrator!');
    setFeedbackSubject('');
    setFeedbackMessage('');
    setFeedbackRating('5');
    setTimeout(() => setAlertMsg(null), 4000);
  };

  return (
    <div className="main-container">
      {/* Student Welcome Banner */}
      <div className="card welcome-banner" style={{ marginBottom: '2rem', borderLeft: '5px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 700 }}>Welcome, {currentUser.name}!</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Academic Department: <strong style={{ color: 'var(--text-main)' }}>{currentUser.branch}</strong> | 
              Email: <span>{currentUser.email}</span>
            </p>
          </div>
          <div>
            <span className={`badge ${currentUser.role === 'admin' ? 'badge-warning' : 'badge-primary'}`} style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
              Role: {currentUser.role.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="section-header">
        <h2>Academic Quick Access</h2>
        <p>Jump to your curriculum materials, assignments, or campus events</p>
      </div>

      <div className="grid-cards" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header">
              <h3 className="card-title">Study Materials</h3>
              <span className="badge badge-primary">Library</span>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Access lecture slides, textbook reference guides, and PDF notes uploaded by faculty.
            </p>
          </div>
          <button className="btn btn-primary btn-block" onClick={() => onNavigate('materials')}>
            Explore Materials
          </button>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header">
              <h3 className="card-title">Assignments Tracker</h3>
              <span className="badge badge-warning">Deadlines</span>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Review pending coursework, problem sets, and submission deadline countdowns.
            </p>
          </div>
          <button className="btn btn-primary btn-block" onClick={() => onNavigate('assignments')}>
            View Assignments
          </button>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header">
              <h3 className="card-title">College Events</h3>
              <span className="badge badge-success">Campus Life</span>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Discover technical symposiums, coding hackathons, guest lectures, and cultural fests.
            </p>
          </div>
          <button className="btn btn-primary btn-block" onClick={() => onNavigate('events')}>
            View Events
          </button>
        </div>
      </div>

      {/* Split Section: Announcements (Left) and Feedback Form (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Recent Announcements */}
        <div>
          <div className="section-header">
            <h2>Campus Announcements</h2>
            <p>Official notices and academic alerts</p>
          </div>

          {announcements.map((item) => (
            <div key={item.id} className="card" style={{ marginBottom: '1rem' }}>
              <div className="card-header" style={{ marginBottom: '0.4rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{item.title}</h4>
                <span className={`badge ${item.category === 'Exam' ? 'badge-danger' : item.category === 'Academic' ? 'badge-warning' : 'badge-primary'}`}>
                  {item.category}
                </span>
              </div>
              <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                {item.content}
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Posted by: {item.published_by}</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Submission Form */}
        <div>
          <div className="section-header">
            <h2>Student Feedback</h2>
            <p>Submit queries or suggestions to administrators</p>
          </div>

          <div className="card">
            {alertMsg && <div className="alert alert-success">{alertMsg}</div>}

            <form onSubmit={handleFeedbackSubmit}>
              <div className="form-group">
                <label className="form-label">Subject / Query Topic</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Lab equipment or library timings"
                  value={feedbackSubject}
                  onChange={(e) => setFeedbackSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Satisfaction Rating</label>
                <select
                  className="form-control"
                  value={feedbackRating}
                  onChange={(e) => setFeedbackRating(e.target.value)}
                >
                  <option value="5">5 – Excellent</option>
                  <option value="4">4 – Good</option>
                  <option value="3">3 – Average</option>
                  <option value="2">2 – Poor</option>
                  <option value="1">1 – Dissatisfied</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message Details</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Describe your suggestion or feedback in detail..."
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

