import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Sun, Moon, LogIn, User as UserIcon, FolderClock, LogOut } from 'lucide-react';

export default function Navbar({ theme, toggleTheme, onOpenHistory, onOpenAuth }) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '1rem 2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            <BookOpen size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
              Kognit AI <span style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.85rem' }}>Study Assistant</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI-Powered Interactive Flashcards & Quiz Suite</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{ padding: '0.5rem', borderRadius: '50%' }}
            title="Toggle color theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user && (
            <button
              onClick={onOpenHistory}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
            >
              <FolderClock size={16} />
              Saved Study Sessions
            </button>
          )}

          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem', borderColor: 'var(--accent-primary)' }}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <UserIcon size={16} style={{ color: 'var(--accent-primary)' }} />
                )}
                <span>{user.name}</span>
              </button>

              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  width: '180px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.5rem',
                  zIndex: 50
                }}>
                  <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Signed in as <strong>{user.email}</strong>
                  </div>
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className="btn btn-danger"
                    style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'flex-start', fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={onOpenAuth} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <LogIn size={16} />
              Sign In / Register
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
