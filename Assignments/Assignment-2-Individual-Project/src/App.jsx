import React, { useState, useEffect } from 'react';
import initialData from './data.json';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Materials from './components/Materials';
import Assignments from './components/Assignments';
import Events from './components/Events';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';

export default function App() {
  // Application Data States (synced with localStorage for persistence)
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('collegehub_students');
    return saved ? JSON.parse(saved) : initialData.students;
  });

  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem('collegehub_materials');
    return saved ? JSON.parse(saved) : initialData.materials;
  });

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('collegehub_assignments');
    return saved ? JSON.parse(saved) : initialData.assignments;
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('collegehub_announcements');
    return saved ? JSON.parse(saved) : initialData.announcements;
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('collegehub_events');
    return saved ? JSON.parse(saved) : initialData.events;
  });

  const [feedbacks, setFeedbacks] = useState(() => {
    const saved = localStorage.getItem('collegehub_feedbacks');
    return saved ? JSON.parse(saved) : initialData.feedback;
  });

  // User Session State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('collegehub_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState(() => {
    return currentUser ? (currentUser.role === 'admin' ? 'admin' : 'dashboard') : 'home';
  });

  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('collegehub_students', JSON.stringify(students));
    localStorage.setItem('collegehub_materials', JSON.stringify(materials));
    localStorage.setItem('collegehub_assignments', JSON.stringify(assignments));
    localStorage.setItem('collegehub_announcements', JSON.stringify(announcements));
    localStorage.setItem('collegehub_events', JSON.stringify(events));
    localStorage.setItem('collegehub_feedbacks', JSON.stringify(feedbacks));
    if (currentUser) {
      localStorage.setItem('collegehub_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('collegehub_current_user');
    }
  }, [students, materials, assignments, announcements, events, feedbacks, currentUser]);

  // Auth Handlers
  const handleLogin = (email, password) => {
    const user = students.find((s) => s.email.toLowerCase() === email.toLowerCase());
    // Allow demo passwords: 'admin123' or 'student123' or any password for registered users
    if (user) {
      setCurrentUser(user);
      setIsAuthOpen(false);
      setActiveTab(user.role === 'admin' ? 'admin' : 'dashboard');
      return true;
    }
    return false;
  };

  const handleRegister = ({ name, email, branch }) => {
    const existing = students.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (existing) return false;

    const newStudent = {
      id: students.length + 1,
      name,
      email,
      branch,
      role: 'student',
      joined: new Date().toISOString().split('T')[0]
    };

    setStudents([...students, newStudent]);
    setCurrentUser(newStudent);
    setIsAuthOpen(false);
    setActiveTab('dashboard');
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  // Feedback Handlers
  const handleSubmitFeedback = ({ subject, rating, message }) => {
    const newFeedback = {
      id: feedbacks.length + 1,
      student_id: currentUser ? currentUser.id : 0,
      student_name: currentUser ? currentUser.name : 'Anonymous Student',
      student_email: currentUser ? currentUser.email : 'student@collegehub.com',
      student_branch: currentUser ? currentUser.branch : 'General',
      subject,
      rating,
      message,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    setFeedbacks([newFeedback, ...feedbacks]);
  };

  const handleToggleFeedbackStatus = (id) => {
    setFeedbacks(
      feedbacks.map((fb) => (fb.id === id ? { ...fb, status: fb.status === 'reviewed' ? 'pending' : 'reviewed' } : fb))
    );
  };

  const handleDeleteFeedback = (id) => {
    setFeedbacks(feedbacks.filter((fb) => fb.id !== id));
  };

  // Content Handlers (Admin)
  const handleAddMaterial = (mat) => setMaterials([{ id: materials.length + 1, ...mat }, ...materials]);
  const handleDeleteMaterial = (id) => setMaterials(materials.filter((m) => m.id !== id));

  const handleAddAssignment = (assign) => setAssignments([{ id: assignments.length + 1, ...assign }, ...assignments]);
  const handleDeleteAssignment = (id) => setAssignments(assignments.filter((a) => a.id !== id));

  const handleAddAnnouncement = (ann) => setAnnouncements([{ id: announcements.length + 1, ...ann }, ...announcements]);
  const handleDeleteAnnouncement = (id) => setAnnouncements(announcements.filter((an) => an.id !== id));

  const handleAddEvent = (evt) => setEvents([{ id: events.length + 1, ...evt }, ...events]);
  const handleDeleteEvent = (id) => setEvents(events.filter((ev) => ev.id !== id));

  const handleDeleteStudent = (id) => setStudents(students.filter((st) => st.id !== id));

  return (
    <div className="app-wrapper">
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={(mode) => { setAuthMode(mode); setIsAuthOpen(true); }}
        onLogout={handleLogout}
      />

      {/* VIEW 1: LANDING PAGE */}
      {activeTab === 'home' && (
        <>
          <header className="hero">
            <div className="hero-content">
              <span className="hero-tagline">Assignment 2 – Individual Project</span>
              <h1>CollegeHub: Smart Campus Management System</h1>
              <p>
                A unified platform enabling students to explore study materials, track pending coursework deadlines, 
                view campus notices, explore college events, and submit direct feedback to administrators.
              </p>
              <div className="hero-buttons">
                {currentUser ? (
                  <button className="btn btn-primary" onClick={() => setActiveTab(currentUser.role === 'admin' ? 'admin' : 'dashboard')}>
                    Go to Your Dashboard
                  </button>
                ) : (
                  <>
                    <button className="btn btn-primary" onClick={() => { setAuthMode('register'); setIsAuthOpen(true); }}>
                      Create Student Account
                    </button>
                    <button className="btn btn-outline" onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }}>
                      Sign In to Portal
                    </button>
                  </>
                )}
              </div>
            </div>
          </header>

          <main className="main-container">
            <div className="section-header">
              <h2>Project Highlights & Features</h2>
              <p>Designed and built for Assignment 2 Individual Project submission</p>
            </div>

            <div className="grid-cards">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Study Materials</h3>
                  <span className="badge badge-primary">Library</span>
                </div>
                <p>Download lecture slides, PDF notes, and syllabus guides curated by department faculty.</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Assignments Tracker</h3>
                  <span className="badge badge-warning">Action Required</span>
                </div>
                <p>Monitor pending coursework deadlines with dynamic days-remaining countdown badges.</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Campus Announcements</h3>
                  <span className="badge badge-danger">Notices</span>
                </div>
                <p>Stay informed with urgent timetable releases, exam circulars, and departmental notices.</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">College Events</h3>
                  <span className="badge badge-success">Campus Life</span>
                </div>
                <p>Explore dates, venues, and schedules for college seminars, hackathons, and annual fests.</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Student Inquiries</h3>
                  <span className="badge badge-primary">Feedback</span>
                </div>
                <p>Submit campus queries, lab improvement suggestions, and ratings directly to the admin.</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Admin Control Center</h3>
                  <span className="badge badge-warning">Admin Mode</span>
                </div>
                <p>Comprehensive dashboard for faculty to publish materials, schedule events, and manage feedback.</p>
              </div>
            </div>
          </main>
        </>
      )}

      {/* VIEW 2: STUDENT DASHBOARD */}
      {activeTab === 'dashboard' && currentUser && (
        <Dashboard
          currentUser={currentUser}
          announcements={announcements}
          onNavigate={setActiveTab}
          onSubmitFeedback={handleSubmitFeedback}
        />
      )}

      {/* VIEW 3: STUDY MATERIALS */}
      {activeTab === 'materials' && (
        <Materials materials={materials} />
      )}

      {/* VIEW 4: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <Assignments assignments={assignments} />
      )}

      {/* VIEW 5: EVENTS */}
      {activeTab === 'events' && (
        <Events events={events} />
      )}

      {/* VIEW 6: ADMIN CONTROL CENTER */}
      {activeTab === 'admin' && currentUser && currentUser.role === 'admin' && (
        <AdminPanel
          students={students}
          materials={materials}
          assignments={assignments}
          announcements={announcements}
          events={events}
          feedbacks={feedbacks}
          onAddMaterial={handleAddMaterial}
          onDeleteMaterial={handleDeleteMaterial}
          onAddAssignment={handleAddAssignment}
          onDeleteAssignment={handleDeleteAssignment}
          onAddAnnouncement={handleAddAnnouncement}
          onDeleteAnnouncement={handleDeleteAnnouncement}
          onAddEvent={handleAddEvent}
          onDeleteEvent={handleDeleteEvent}
          onToggleFeedbackStatus={handleToggleFeedbackStatus}
          onDeleteFeedback={handleDeleteFeedback}
          onDeleteStudent={handleDeleteStudent}
        />
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div>
            <strong>Assignment 2 – Individual Project | CollegeHub</strong>
            <p>&copy; 2026 Academic Submission. Developed by Lokesh Karrothu.</p>
          </div>
          <ul className="footer-links">
            <li><button className="link-btn" onClick={() => setActiveTab('home')}>Home</button></li>
            <li><button className="link-btn" onClick={() => setActiveTab('materials')}>Materials</button></li>
            <li><button className="link-btn" onClick={() => setActiveTab('assignments')}>Assignments</button></li>
            <li><button className="link-btn" onClick={() => setActiveTab('events')}>Events</button></li>
          </ul>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}

