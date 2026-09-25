const Session = require('../models/Session');
const { validateStudyAssistant } = require('../utils/schemaValidator');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_CANDIDATES = [
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.8-27b',
  'allam-2-7b',
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant'
];

const SYSTEM_PROMPT = `You are an expert AI Study Assistant. You output strictly raw JSON matching the exact schema specified below. Do not include markdown codeblocks or prose text.

JSON Schema:
{
  "title": "Subject Title",
  "summary": {
    "overview": "Comprehensive 2-3 sentence overview of the topic",
    "keyTakeaways": ["Key concept 1", "Key concept 2", "Key concept 3", "Key concept 4"]
  },
  "cards": [
    {
      "id": "card_1",
      "question": "Question testing core concept",
      "answer": "Clear detailed answer",
      "explanation": "Additional context or memory mnemonic",
      "difficulty": "Easy | Medium | Hard"
    }
  ],
  "quiz": [
    {
      "id": "q_1",
      "question": "Multiple choice question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why option A is correct"
    }
  ]
}

Provide at least 5 flashcards and at least 4 quiz questions. Ensure correctAnswer is a 0-indexed integer corresponding to the correct option index.`;

exports.generateStructuredData = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Prompt input cannot be empty. Please provide descriptive notes or topic.'
      });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'CONFIG_ERROR',
        message: 'Groq API key is missing on the server environment.'
      });
    }

    const userMessage = `Generate study flashcards, quiz, and summary for:\n${prompt.trim()}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    let groqResponse = null;
    let lastErrorText = '';

    for (const modelName of MODEL_CANDIDATES) {
      try {
        groqResponse = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userMessage }
            ],
            temperature: 0.3
          }),
          signal: controller.signal
        });

        if (groqResponse.ok) {
          break;
        } else {
          lastErrorText = await groqResponse.text();
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          clearTimeout(timeoutId);
          return res.status(504).json({
            error: 'TIMEOUT_ERROR',
            message: 'The AI model request timed out after 30 seconds. Please try again.'
          });
        }
      }
    }

    clearTimeout(timeoutId);

    if (!groqResponse || !groqResponse.ok) {
      return res.status(502).json({
        error: 'LLM_API_ERROR',
        message: `Groq API error: ${lastErrorText || 'Failed to connect to active LLM models.'}`
      });
    }

    const responseData = await groqResponse.json();
    const rawContent = responseData?.choices?.[0]?.message?.content;

    if (!rawContent) {
      return res.status(422).json({
        error: 'EMPTY_RESPONSE',
        message: 'AI model returned an empty text response.'
      });
    }

    let parsedData;
    try {
      const sanitized = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(sanitized);
    } catch (parseErr) {
      return res.status(422).json({
        error: 'MALFORMED_JSON',
        message: 'AI model response could not be parsed as valid JSON.',
        raw: rawContent
      });
    }

    const isValid = validateStudyAssistant(parsedData);
    if (!isValid) {
      return res.status(422).json({
        error: 'INVALID_SCHEMA_SHAPE',
        message: 'AI response was valid JSON but lacked required flashcard or quiz fields.',
        parsed: parsedData
      });
    }

    let savedSession = null;
    if (req.user) {
      try {
        savedSession = await Session.create({
          user: req.user._id,
          title: parsedData.title || 'Study Session',
          type: 'study_assistant',
          prompt: prompt.trim(),
          structuredData: parsedData,
          userProgress: {}
        });
      } catch (dbErr) {
      }
    }

    return res.status(200).json({
      success: true,
      data: parsedData,
      sessionId: savedSession ? savedSession._id : null
    });

  } catch (error) {
    return res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'An unexpected internal error occurred on server.'
    });
  }
};
