import React, { useState } from 'react';
import { Send, Trash2, Zap, BookOpen } from 'lucide-react';

const STUDY_PRESETS = [
  'Quantum Computing basics, qubits, superposition, entanglement and quantum cryptography',
  'JavaScript Async programming: Event loop, Promises, Async/Await and Microtasks',
  'Cellular Respiration: Glycolysis, Krebs cycle, and Electron Transport Chain',
  'Organic Chemistry: Functional groups, stereochemistry, and reaction mechanisms'
];

export default function PromptInput({ onGenerate, isLoading }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate(prompt.trim());
  };

  const handleSelectPreset = (presetText) => {
    setPrompt(presetText);
  };

  return (
    <div className="glass-panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={20} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Study Deck & Quiz Generator
          </h2>
        </div>
        <span className="badge badge-primary">Structured AI Output</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Paste your study notes, textbook excerpt, or enter a topic (e.g. Machine Learning, Ancient History, Organic Chemistry)..."
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              resize: 'vertical'
            }}
          />
          {prompt && (
            <button
              type="button"
              onClick={() => setPrompt('')}
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                color: 'var(--text-muted)'
              }}
              title="Clear input"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>{prompt.length} characters</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="btn btn-primary"
              style={{ minWidth: '180px' }}
            >
              <Send size={16} />
              <span>{isLoading ? 'Generating Deck...' : 'Generate Study Suite'}</span>
            </button>
          </div>
        </div>
      </form>

      <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          <Zap size={14} style={{ color: 'var(--warning)' }} />
          <span>Quick sample study topics:</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {STUDY_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                textAlign: 'left'
              }}
            >
              {preset.length > 55 ? preset.substring(0, 55) + '...' : preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
