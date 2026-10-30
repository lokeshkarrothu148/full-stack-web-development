import React from 'react';

export default function Assignments({ assignments }) {
  const getDeadlineStatus = (deadlineStr) => {
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diffMs = deadline - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 0) {
      return <span className="badge badge-danger">Deadline Passed</span>;
    } else if (diffDays <= 2) {
      return <span className="badge badge-warning">Due in {diffDays} day{diffDays === 1 ? '' : 's'}</span>;
    } else {
      return <span className="badge badge-success">{diffDays} days remaining</span>;
    }
  };

  return (
    <div className="main-container">
      <div className="section-header">
        <h2>Coursework & Lab Assignments</h2>
        <p>Review problem statements, instructions, and submission deadlines</p>
      </div>

      <div className="grid-cards">
        {assignments.length > 0 ? (
          assignments.map((item) => {
            const formattedDate = new Date(item.deadline).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="card-header">
                    <span className="badge badge-primary">{item.subject}</span>
                    {getDeadlineStatus(item.deadline)}
                  </div>

                  <h3 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>
                    {item.title}
                  </h3>

                  <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '1.25rem', whiteSpace: 'pre-line' }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div><strong>Deadline:</strong> {formattedDate}</div>
                  <div style={{ marginTop: '0.25rem' }}><strong>Instructor:</strong> {item.created_by || 'Department Faculty'}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <h3>No assignments active</h3>
            <p>Check back later for newly announced assignments.</p>
          </div>
        )}
      </div>
    </div>
  );
}

