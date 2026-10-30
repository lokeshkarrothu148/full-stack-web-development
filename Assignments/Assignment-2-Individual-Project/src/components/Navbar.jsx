import React from 'react';

export default function Navbar({ currentUser, activeTab, setActiveTab, onOpenAuth, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="brand-logo" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
          <svg className="brand-icon" viewBox="0 0 24 24">
            <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/>
          </svg>
          <span>CollegeHub</span>
        </div>

        <ul className="nav-links">
          <li>
            <button 
              className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              Home
            </button>
          </li>
          {currentUser && (
            <>
              <li>
                <button 
                  className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  className={`nav-btn ${activeTab === 'materials' ? 'active' : ''}`}
                  onClick={() => setActiveTab('materials')}
                >
                  Study Materials
                </button>
              </li>
              <li>
                <button 
                  className={`nav-btn ${activeTab === 'assignments' ? 'active' : ''}`}
                  onClick={() => setActiveTab('assignments')}
                >
                  Assignments
                </button>
              </li>
              <li>
                <button 
                  className={`nav-btn ${activeTab === 'events' ? 'active' : ''}`}
                  onClick={() => setActiveTab('events')}
                >
                  Events
                </button>
              </li>
              {currentUser.role === 'admin' && (
                <li>
                  <button 
                    className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
                    onClick={() => setActiveTab('admin')}
                  >
                    Admin Center
                  </button>
                </li>
              )}
            </>
          )}
        </ul>

        <div className="nav-auth">
          {currentUser ? (
            <>
              <span className={`user-badge ${currentUser.role === 'admin' ? 'badge-admin' : ''}`}>
                {currentUser.name} ({currentUser.role})
              </span>
              <button className="btn btn-outline btn-sm" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-outline btn-sm" onClick={() => onOpenAuth('login')}>
                Sign In
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => onOpenAuth('register')}>
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

