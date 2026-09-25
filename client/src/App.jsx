import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PromptInput from './components/PromptInput';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import ResultView from './components/ResultView';
import SessionHistory from './components/SessionHistory';
import AuthModal from './components/AuthModal';
import { callBackendProxy, cancelActiveRequest } from './services/api';

function MainWorkspace() {
  const { token } = useAuth();
  const [theme, setTheme] = useState('dark');
  const [isLoading, setIsLoading] = useState(false);
  const [errorObj, setErrorObj] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [userProgress, setUserProgress] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!token) {
      cancelActiveRequest();
      setResultData(null);
      setCurrentPrompt('');
      setUserProgress({});
      setErrorObj(null);
      setIsLoading(false);
      setShowHistory(false);
      setShowAuthModal(false);
    }
  }, [token]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleGenerate = async (promptText) => {
    setCurrentPrompt(promptText);
    setIsLoading(true);
    setErrorObj(null);
    setResultData(null);
    setUserProgress({});

    try {
      const response = await callBackendProxy(promptText, token);
      if (response && response.data) {
        setResultData(response.data);
      } else {
        throw { error: 'EMPTY_RESPONSE', message: 'No data returned from backend.' };
      }
    } catch (err) {
      if (err.isCancelled) return;
      setErrorObj(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = () => {
    cancelActiveRequest();
    setIsLoading(false);
  };

  const handleLoadSession = (session) => {
    if (session && session.structuredData) {
      setResultData(session.structuredData);
      setUserProgress(session.userProgress || {});
      setErrorObj(null);
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenHistory={() => setShowHistory(true)}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      <main className="main-content">
        <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />

        {isLoading && <LoadingState onCancel={handleCancelRequest} />}

        {!isLoading && errorObj && (
          <ErrorState errorObj={errorObj} onRetry={() => handleGenerate(currentPrompt)} />
        )}

        {!isLoading && !errorObj && resultData && (
          <ResultView
            data={resultData}
            userProgress={userProgress}
            onProgressChange={setUserProgress}
            onRetry={() => handleGenerate(currentPrompt)}
          />
        )}
      </main>

      <SessionHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onLoadSession={handleLoadSession}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '799100267306-b0ilknmqjhelhmrue8mm74bkeb3hbp7a.apps.googleusercontent.com';

export default function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <MainWorkspace />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

