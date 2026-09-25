import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Award, ArrowRight } from 'lucide-react';

export default function QuizView({ quiz = [] }) {
  const [activeQuestions, setActiveQuestions] = useState(quiz);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!quiz || quiz.length === 0) return null;

  const currentQ = activeQuestions[currentIndex];

  const handleSelectOption = (optIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: optIdx
    }));
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsSubmitted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    activeQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const handleRetestWrongAnswers = () => {
    const wrongQuestions = activeQuestions.filter(q => selectedAnswers[q.id] !== q.correctAnswer);
    if (wrongQuestions.length > 0) {
      setActiveQuestions(wrongQuestions);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setIsSubmitted(false);
    }
  };

  const handleResetFullQuiz = () => {
    setActiveQuestions(quiz);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const score = calculateScore();
  const percentage = Math.round((score / activeQuestions.length) * 100);

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle size={20} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Knowledge Assessment Quiz
          </h3>
        </div>
        {!isSubmitted && (
          <span className="badge badge-primary">
            Question {currentIndex + 1} of {activeQuestions.length}
          </span>
        )}
      </div>

      {isSubmitted ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: percentage >= 70 ? 'var(--success-light)' : 'var(--warning-light)',
            color: percentage >= 70 ? 'var(--success)' : 'var(--warning)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <Award size={32} />
          </div>

          <h4 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Quiz Completed!
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            You scored <strong>{score}</strong> out of <strong>{activeQuestions.length}</strong> ({percentage}%)
          </p>

          <div style={{ maxWidth: '600px', margin: '0 auto 2rem auto', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeQuestions.map((q, idx) => {
              const userAns = selectedAnswers[q.id];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <div key={q.id} style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card)',
                  border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    {isCorrect ? <CheckCircle size={16} style={{ color: 'var(--success)' }} /> : <XCircle size={16} style={{ color: 'var(--danger)' }} />}
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {idx + 1}. {q.question}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
                    <div>Your answer: <strong>{userAns !== undefined ? q.options[userAns] : 'Not answered'}</strong></div>
                    {!isCorrect && <div style={{ color: 'var(--success)' }}>Correct answer: <strong>{q.options[q.correctAnswer]}</strong></div>}
                    {q.explanation && <div style={{ fontStyle: 'italic', marginTop: '0.25rem', color: 'var(--text-muted)' }}>{q.explanation}</div>}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {activeQuestions.length - score > 0 && (
              <button onClick={handleRetestWrongAnswers} className="btn btn-primary">
                <RotateCcw size={16} />
                <span>Re-test Wrong Answers ({activeQuestions.length - score})</span>
              </button>
            )}
            <button onClick={handleResetFullQuiz} className="btn btn-secondary">
              <RotateCcw size={16} />
              <span>Restart Full Quiz</span>
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            {currentQ.question}
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentQ.id] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--accent-light)' : 'var(--bg-card)',
                    border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                    textAlign: 'left',
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? 600 : 400
                  }}
                >
                  <span>{option}</span>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isSelected ? 'var(--accent-primary)' : 'transparent'
                  }}>
                    {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />}
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQ.id] === undefined}
              className="btn btn-primary"
            >
              <span>{currentIndex === activeQuestions.length - 1 ? 'Finish & See Score' : 'Next Question'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
