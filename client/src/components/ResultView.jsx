import React from 'react';
import { validateResult } from '../services/validateResult';
import ErrorState from './ErrorState';
import FlashcardDeck from './StudyAssistant/FlashcardDeck';
import QuizView from './StudyAssistant/QuizView';
import SummaryView from './StudyAssistant/SummaryView';

export default function ResultView({ data, userProgress, onProgressChange, onRetry }) {
  if (!data) return null;

  const validation = validateResult(data);
  if (!validation.valid) {
    return (
      <ErrorState
        errorObj={{
          error: 'INVALID_SCHEMA_SHAPE',
          message: `Defensive validation failed: ${validation.reason}`,
          parsed: data
        }}
        onRetry={onRetry}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <SummaryView summary={data.summary} />
      <FlashcardDeck cards={data.cards} userProgress={userProgress} onProgressChange={onProgressChange} />
      <QuizView quiz={data.quiz} />
    </div>
  );
}
