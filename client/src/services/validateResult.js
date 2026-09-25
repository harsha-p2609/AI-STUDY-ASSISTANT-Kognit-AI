export function validateResult(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, reason: 'Response data is null or not an object.' };
  }

  if (!Array.isArray(data.cards) || data.cards.length === 0) {
    return { valid: false, reason: 'Missing or empty flashcards array.' };
  }

  for (let i = 0; i < data.cards.length; i++) {
    const card = data.cards[i];
    if (!card.question || !card.answer) {
      return { valid: false, reason: `Flashcard at index ${i} is missing question or answer.` };
    }
  }

  if (!Array.isArray(data.quiz) || data.quiz.length === 0) {
    return { valid: false, reason: 'Missing or empty quiz array.' };
  }

  for (let i = 0; i < data.quiz.length; i++) {
    const q = data.quiz[i];
    if (!q.question || !Array.isArray(q.options) || q.options.length < 2) {
      return { valid: false, reason: `Quiz item at index ${i} has invalid question or options.` };
    }
    if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
      return { valid: false, reason: `Quiz item at index ${i} has an invalid correctAnswer index.` };
    }
  }

  if (!data.summary || typeof data.summary.overview !== 'string') {
    return { valid: false, reason: 'Missing summary overview section.' };
  }

  return { valid: true };
}
