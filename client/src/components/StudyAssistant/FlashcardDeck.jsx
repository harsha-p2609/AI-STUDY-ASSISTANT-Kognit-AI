import React, { useState, useEffect } from 'react';
import { RotateCw, CheckCircle2, ChevronLeft, ChevronRight, Shuffle, Eye, Volume2, VolumeX, Download, FileText, FileCode } from 'lucide-react';

export default function FlashcardDeck({ cards = [], userProgress = {}, onProgressChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterMode, setFilterMode] = useState('all');
  const [cardDeck, setCardDeck] = useState(cards);
  const [masteredMap, setMasteredMap] = useState(userProgress.masteredMap || {});
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setCardDeck(cards);
  }, [cards]);

  useEffect(() => {
    if (onProgressChange) {
      onProgressChange({ masteredMap });
    }
  }, [masteredMap]);

  const activeDeck = filterMode === 'review'
    ? cardDeck.filter(c => !masteredMap[c.id])
    : cardDeck;

  const currentCard = activeDeck[currentIndex] || activeDeck[0];

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleNext = () => {
    stopSpeech();
    setIsFlipped(false);
    if (currentIndex < activeDeck.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    stopSpeech();
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(activeDeck.length - 1);
    }
  };

  const toggleMastered = (cardId) => {
    setMasteredMap(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const handleShuffle = () => {
    stopSpeech();
    const shuffled = [...cardDeck].sort(() => Math.random() - 0.5);
    setCardDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleSpeak = (e, text) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      stopSpeech();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleDownloadPDF = () => {
    stopSpeech();
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Kognit AI Study Deck PDF</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 2rem; color: #0f172a; line-height: 1.6; }
          h1 { font-size: 1.75rem; color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; margin-bottom: 0.25rem; }
          .subtitle { font-size: 0.875rem; color: #64748b; margin-bottom: 1.5rem; }
          .card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem; page-break-inside: avoid; background: #f8fafc; }
          .badge { display: inline-block; background: #4f46e5; color: white; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase; margin-bottom: 0.5rem; }
          .q { font-size: 1.05rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem; }
          .a { font-size: 0.95rem; color: #15803d; font-weight: 600; margin-top: 0.5rem; }
          .exp { font-size: 0.85rem; color: #475569; font-style: italic; margin-top: 0.35rem; }
        </style>
      </head>
      <body>
        <h1>Kognit AI — Study Flashcards Deck</h1>
        <div class="subtitle">Exported Interactive Flashcards (${cards.length} Cards)</div>
    `;

    cards.forEach((card, idx) => {
      html += `
        <div class="card">
          <span class="badge">${card.difficulty || 'Medium'}</span>
          <div class="q">Q${idx + 1}: ${card.question}</div>
          <div class="a">Answer: ${card.answer}</div>
          ${card.explanation ? `<div class="exp">Explanation: ${card.explanation}</div>` : ''}
        </div>
      `;
    });

    html += `
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopSpeech();
    };
  }, [currentIndex, activeDeck]);

  if (!cards || cards.length === 0) return null;

  const masteredCount = Object.values(masteredMap).filter(Boolean).length;
  const progressPercent = Math.round((masteredCount / cards.length) * 100);

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Interactive 3D Flashcards
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Click card or press Space to flip. Use Arrow keys to navigate.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setFilterMode(filterMode === 'all' ? 'review' : 'all'); setCurrentIndex(0); setIsFlipped(false); }}
            className={`btn ${filterMode === 'review' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
          >
            <Eye size={14} />
            <span>{filterMode === 'review' ? 'Needs Review Only' : 'All Cards'}</span>
          </button>
          
          <button
            onClick={handleShuffle}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
            title="Shuffle deck"
          >
            <Shuffle size={14} />
            <span>Shuffle</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
            title="Download formatted PDF study guide"
          >
            <Download size={14} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', height: '6px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${progressPercent}%`,
          background: 'var(--accent-primary)',
          transition: 'width 0.3s ease'
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span>Mastered: {masteredCount} / {cards.length} cards ({progressPercent}%)</span>
        {activeDeck.length > 0 && <span>Card {currentIndex + 1} of {activeDeck.length}</span>}
      </div>

      {!currentCard ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontWeight: 600 }}>All cards in this view have been mastered!</p>
          <button
            onClick={() => setFilterMode('all')}
            className="btn btn-secondary"
            style={{ marginTop: '1rem', fontSize: '0.8rem' }}
          >
            View All Cards
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
          
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              width: '100%',
              minHeight: '260px',
              perspective: '1000px',
              cursor: 'pointer'
            }}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              minHeight: '260px',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}>
              
              <div style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                background: 'var(--bg-card)',
                border: `2px solid ${masteredMap[currentCard.id] ? 'var(--success)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-md)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge ${currentCard.difficulty === 'Hard' ? 'badge-warning' : 'badge-primary'}`}>
                    {currentCard.difficulty || 'Medium'}
                  </span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={(e) => handleSpeak(e, currentCard.question)}
                      style={{ color: isSpeaking ? 'var(--accent-primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      title="Audio Read-Aloud"
                    >
                      {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <RotateCw size={12} /> Click or space to flip
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary)', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                    QUESTION
                  </span>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {currentCard.question}
                  </h4>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleMastered(currentCard.id); }}
                    className={`btn ${masteredMap[currentCard.id] ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      fontSize: '0.8rem',
                      padding: '0.4rem 0.85rem',
                      borderColor: masteredMap[currentCard.id] ? undefined : 'var(--success)',
                      color: masteredMap[currentCard.id] ? undefined : 'var(--success)'
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>{masteredMap[currentCard.id] ? 'Mastered' : 'Mark as Mastered'}</span>
                  </button>
                </div>
              </div>

              <div style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: 'var(--bg-card)',
                border: `2px solid ${masteredMap[currentCard.id] ? 'var(--success)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-md)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-success">
                    Answer
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={(e) => handleSpeak(e, `${currentCard.answer}. ${currentCard.explanation || ''}`)}
                      style={{ color: isSpeaking ? 'var(--accent-primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      title="Audio Read-Aloud"
                    >
                      {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <RotateCw size={12} /> Click or space to flip
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--success)', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                    ANSWER & EXPLANATION
                  </span>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {currentCard.answer}
                  </h4>
                  {currentCard.explanation && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem', fontStyle: 'italic' }}>
                      {currentCard.explanation}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleMastered(currentCard.id); }}
                    className={`btn ${masteredMap[currentCard.id] ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      fontSize: '0.8rem',
                      padding: '0.4rem 0.85rem',
                      borderColor: masteredMap[currentCard.id] ? undefined : 'var(--success)',
                      color: masteredMap[currentCard.id] ? undefined : 'var(--success)'
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>{masteredMap[currentCard.id] ? 'Mastered' : 'Mark as Mastered'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={handlePrev} className="btn btn-secondary" style={{ padding: '0.6rem 1rem' }}>
              <ChevronLeft size={18} />
              <span>Previous</span>
            </button>
            <button onClick={handleNext} className="btn btn-primary" style={{ padding: '0.6rem 1rem' }}>
              <span>Next Card</span>
              <ChevronRight size={18} />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

