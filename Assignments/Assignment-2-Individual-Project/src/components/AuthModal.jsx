import React, { useState } from 'react';

export default function AuthModal({ isOpen, initialMode, onClose, onLogin, onRegister }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState(initialMode || 'login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      if (!email.trim() || !password) {
        setError('Please enter both email and password.');
        return;
      }
      const success = onLogin(email.trim(), password);
      if (!success) {
        setError('Invalid credentials. Use student or admin demo credentials below.');
      }
    } else {
      if (!name.trim() || !email.trim() || !password) {
        setError('All fields are required.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      const success = onRegister({ name: name.trim(), email: email.trim(), branch, password });
      if (!success) {
        setError('An account with this email already exists.');
      }
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'student') {
      setEmail('rahul.sharma@collegehub.com');
      setPassword('student123');
    } else if (type === 'admin') {
      setEmail('admin@collegehub.com');
      setPassword('admin123');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem'
    }}>
      <div className="card auth-card" style={{ width: '100%', maxWidth: '440px', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
        >
          ✕
        </button>

        <div className="auth-header">
          <h2>{mode === 'login' ? 'Sign In to CollegeHub' : 'Student Registration'}</h2>
          <p>{mode === 'login' ? 'Access your student portal or admin controls' : 'Create a new student account'}</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Academic Department / Branch</label>
                <select className="form-control" value={branch} onChange={(e) => setBranch(e.target.value)}>
                  <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                  <option value="Information Technology">Information Technology (IT)</option>
                  <option value="Electronics & Communication">Electronics & Communication (ECE)</option>
                  <option value="Mechanical Engineering">Mechanical Engineering (ME)</option>
                  <option value="Civil Engineering">Civil Engineering (CE)</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">College Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. rahul.sharma@collegehub.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {mode === 'login' && (
          <div className="demo-credentials-box">
            <h4>Evaluation Demo Credentials:</h4>
            <div className="demo-btn-group">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleFillDemo('student')}>
                Fill Student Demo
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleFillDemo('admin')}>
                Fill Admin Demo
              </button>
            </div>
          </div>
        )}

        <div className="auth-footer">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => { setMode('register'); setError(null); }}
              >
                Register here
              </button>
            </>
          ) : (
            <>
              Already registered?{' '}
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => { setMode('login'); setError(null); }}
              >
                Sign in here
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

