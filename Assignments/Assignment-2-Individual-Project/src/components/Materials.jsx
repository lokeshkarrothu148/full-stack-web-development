import React, { useState } from 'react';

export default function Materials({ materials }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const filteredMaterials = materials.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || item.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="main-container">
      <div className="section-header">
        <h2>Academic Study Materials & Notes</h2>
        <p>Download lecture slides, syllabus guides, and reference documents</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div>
            <label className="form-label">Search by Title or Keyword</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Data Structures, Normalization, TCP/IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Filter by Subject</label>
            <select
              className="form-control"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="All">All Subjects</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
              <option value="Electrical">Electrical</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>

          <div>
            <button 
              className="btn btn-secondary btn-block" 
              onClick={() => { setSearchTerm(''); setSelectedSubject('All'); }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid-cards">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((item) => (
            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="card-header">
                  <span className="badge badge-primary">{item.subject}</span>
                  <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>{item.file_type || 'PDF Document'}</span>
                </div>
                <h3 className="card-title" style={{ fontSize: '1.15rem', marginBottom: '0.65rem' }}>
                  {item.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  {item.description}
                </p>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                  Uploaded by: {item.uploaded_by || 'Faculty'} • {item.date || 'Recent'}
                </div>
                <a 
                  href={item.file_path} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-outline btn-block"
                >
                  Open / Download Material
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <h3>No study materials match your search</h3>
            <p style={{ marginTop: '0.5rem' }}>Try searching for a different topic or resetting filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

