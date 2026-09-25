import React, { useState, useEffect } from 'react';
import { Loader2, XCircle, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

export default function LoadingState({ onCancel }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getStepStatus = (secondsNeeded) => {
    if (elapsed >= secondsNeeded) return 'completed';
    if (elapsed >= secondsNeeded - 2) return 'active';
    return 'pending';
  };

  return (
    <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
      
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--accent-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-primary)'
        }}>
          <Loader2 size={32} className="pulse-ring" style={{ animation: 'spin 1.5s linear infinite' }} />
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
        Generating Structured Workspace
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Kognit AI backend is communicating with Groq LLM and validating output structure... ({elapsed}s)
      </p>

      <div style={{ maxWidth: '440px', margin: '0 auto 2rem auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', textAling: 'left' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
          <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
          <span style={{ color: 'var(--text-primary)' }}>Formulating structured JSON prompt</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
          <Cpu size={18} style={{ color: elapsed >= 2 ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
          <span style={{ color: elapsed >= 2 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
            Processing model inference via Groq Llama 3.3
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
          <ShieldCheck size={18} style={{ color: elapsed >= 4 ? 'var(--success)' : 'var(--text-muted)' }} />
          <span style={{ color: elapsed >= 4 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
            Defensive schema validation & JSON parsing
          </span>
        </div>

      </div>

      <div>
        <button onClick={onCancel} className="btn btn-secondary" style={{ gap: '0.5rem' }}>
          <XCircle size={16} />
          <span>Cancel Generation</span>
        </button>
      </div>

    </div>
  );
}
