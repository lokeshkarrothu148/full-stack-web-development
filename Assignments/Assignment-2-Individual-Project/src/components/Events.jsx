import React from 'react';

export default function Events({ events }) {
  return (
    <div className="main-container">
      <div className="section-header">
        <h2>Upcoming College Events & Workshops</h2>
        <p>Stay informed about technical symposiums, hackathons, and cultural festivals</p>
      </div>

      <div className="grid-cards">
        {events.length > 0 ? (
          events.map((item) => {
            const formattedDate = new Date(item.event_date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="card-header">
                    <span className="badge badge-success">Event</span>
                    <span className="badge badge-primary">{item.event_time || '10:00 AM'}</span>
                  </div>

                  <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                    {item.title}
                  </h3>

                  <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '1.25rem', whiteSpace: 'pre-line' }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div style={{ marginBottom: '0.35rem' }}>
                    📅 <strong>Date:</strong> {formattedDate}
                  </div>
                  <div>
                    📍 <strong>Venue:</strong> {item.venue}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <h3>No events scheduled</h3>
            <p>New events and seminars will appear here once announced.</p>
          </div>
        )}
      </div>
    </div>
  );
}

