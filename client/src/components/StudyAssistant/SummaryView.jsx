import React, { useState } from 'react';
import { BookOpenCheck, CheckSquare, Square } from 'lucide-react';

export default function SummaryView({ summary = {} }) {
  const [completedItems, setCompletedItems] = useState({});

  if (!summary || !summary.overview) return null;

  const toggleCheck = (idx) => {
    setCompletedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const keyTakeaways = summary.keyTakeaways || [];

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <BookOpenCheck size={20} style={{ color: 'var(--accent-primary)' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Topic Overview & Key Concepts
        </h3>
      </div>

      <div style={{
        background: 'var(--bg-card)',
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        lineHeight: 1.7,
        fontSize: '0.925rem',
        color: 'var(--text-secondary)'
      }}>
        {summary.overview}
      </div>

      {keyTakeaways.length > 0 && (
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Checkable Key Takeaways
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {keyTakeaways.map((item, idx) => {
              const isChecked = !!completedItems[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: isChecked ? 'var(--success-light)' : 'var(--bg-card)',
                    border: `1px solid ${isChecked ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isChecked ? (
                    <CheckSquare size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  ) : (
                    <Square size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  )}
                  <span style={{
                    fontSize: '0.875rem',
                    color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)',
                    textDecoration: isChecked ? 'line-through' : 'none'
                  }}>
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
