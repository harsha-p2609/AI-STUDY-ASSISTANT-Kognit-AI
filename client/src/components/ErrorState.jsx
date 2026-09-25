import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp, Code } from 'lucide-react';

export default function ErrorState({ errorObj, onRetry }) {
  const [showDetails, setShowDetails] = useState(false);

  const getErrorTitle = (code) => {
    switch (code) {
      case 'MALFORMED_JSON':
        return 'Malformed JSON Output Received';
      case 'INVALID_SCHEMA_SHAPE':
        return 'Invalid Response Shape';
      case 'EMPTY_RESPONSE':
        return 'Empty Response from AI Provider';
      case 'TIMEOUT_ERROR':
        return 'Request Timeout (Slow Response)';
      case 'NETWORK_ERROR':
        return 'Backend Network Connection Failed';
      case 'LLM_API_ERROR':
        return 'AI Provider API Error';
      default:
        return 'Generation Error Occurred';
    }
  };

  const title = getErrorTitle(errorObj?.error);
  const message = errorObj?.message || 'An unexpected error occurred while processing the request.';

  return (
    <div className="glass-panel" style={{ borderColor: 'rgba(239, 68, 68, 0.4)', background: 'var(--bg-secondary)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'var(--danger-light)',
          color: 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <AlertTriangle size={24} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-warning" style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)', background: 'var(--danger-light)' }}>
              {errorObj?.error || 'ERROR'}
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            {title}
          </h3>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
            {message}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={onRetry} className="btn btn-primary" style={{ gap: '0.5rem' }}>
              <RefreshCw size={16} />
              <span>Retry Prompt</span>
            </button>

            {(errorObj?.raw || errorObj?.parsed) && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
              >
                <Code size={14} />
                <span>{showDetails ? 'Hide Raw Details' : 'Inspect Raw Payload'}</span>
                {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>

          {showDetails && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              overflowX: 'auto',
              maxHeight: '240px'
            }}>
              <pre>{JSON.stringify(errorObj.raw || errorObj.parsed, null, 2)}</pre>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
