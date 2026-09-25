function validateStudyAssistant(data) {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.cards) || data.cards.length === 0) return false;
  for (const card of data.cards) {
    if (!card.question || !card.answer) return false;
  }
  if (!Array.isArray(data.quiz) || data.quiz.length === 0) return false;
  for (const q of data.quiz) {
    if (!q.question || !Array.isArray(q.options) || q.options.length < 2) return false;
    if (typeof q.correctAnswer !== 'number') return false;
  }
  if (!data.summary || typeof data.summary !== 'object') return false;
  if (!data.summary.overview || !Array.isArray(data.summary.keyTakeaways)) return false;
  return true;
}

module.exports = {
  validateStudyAssistant
};
