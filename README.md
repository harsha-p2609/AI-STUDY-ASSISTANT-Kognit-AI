# Kognit AI — Interactive Study Assistant

> **Flam Frontend Internship Assignment** | AI-Powered Interactive Tool (Not a Chatbot)

Kognit AI is a full-stack AI-powered study assistant that transforms free-form study notes or academic topics into structured, interactive learning experiences.

Instead of presenting AI output as a traditional chatbot conversation, Kognit AI converts model responses into structured learning components such as interactive flashcards, quizzes, summaries, takeaways, progress tracking, and saved study workspaces.

The application uses defensive AI-output validation to ensure malformed or unexpected model responses are handled gracefully before reaching the React UI.

---

##  Core Features

### 1. Free-Form Study Input

Users can provide:

- Raw study notes
- Textbook excerpts
- Academic concepts
- Technical topics
- Any free-form learning material

Preset topics are also available for quick testing.

---

### 2. AI Study Assistant

Kognit AI transforms the provided content into structured learning material.

#### Topic Overview & Takeaways

- Generates a concise topic overview.
- Extracts important concepts and key takeaways.
- Takeaways can be interactively checked off.
- Helps users track the concepts they have reviewed.

#### Interactive 3D Flashcards

- Interactive 3D flip-card animation.
- Click a card to flip between question and answer.
- Press `Spacebar` to flip cards.
- `Left Arrow` and `Right Arrow` navigate between cards.
- Browser-native Text-to-Speech for questions, answers, and explanations.
- Mark cards as **Mastered** or **Needs Review**.
- Live mastery progress tracking.
- Filter cards using:
  - All Cards
  - Needs Review Only
- Export flashcards as a formatted PDF study guide.

#### Knowledge Assessment Quiz

- Question-by-question quiz experience.
- Multiple-choice questions.
- Instant answer feedback.
- Final score and performance breakdown.
- Automatically identifies incorrect answers.
- **Re-Test Wrong Answers** feature for focused revision.

---

##  Authentication & User Accounts

Kognit AI provides multiple authentication methods.

### Google OAuth 2.0

- Google Sign-In using `@react-oauth/google`.
- Google ID tokens are verified on the backend using `google-auth-library`.
- Google authentication is connected to the application's MongoDB user system.

### Email & Password Authentication

- User registration.
- User login.
- Password hashing using bcrypt.
- JWT-based authentication.
- Seven-day authentication tokens.

### Multi-Tab Account Support

Kognit AI supports independent authentication sessions across browser tabs.

Users can:

- Sign in with one account in one browser tab.
- Sign in with a different account in another browser tab.
- Keep both accounts active simultaneously.
- Maintain separate authenticated sessions.
- Access each account's own saved study workspaces.

This is useful for testing multiple accounts, development, QA, and demonstrating user-specific workspaces.

---

##  Saved Study Workspaces

Authenticated users can save and manage their generated study sessions.

Features include:

- Automatic session saving.
- MongoDB-backed persistence.
- Session history drawer.
- Reload previously generated study material.
- Delete saved sessions.
- User-specific session ownership.

Each user's saved workspaces are associated with their authenticated account.

---

#  Defensive AI Output Handling

A major focus of Kognit AI is safely handling unpredictable LLM responses.

The application does not assume that every model response will be valid JSON or follow the expected structure.

AI responses pass through multiple validation and recovery layers.

| Failure Mode | Detection | UI Recovery |
|---|---|---|
| Malformed JSON | `JSON.parse` try/catch | `MALFORMED_JSON` error state with retry |
| Invalid schema | Backend and frontend schema validation | `INVALID_SCHEMA_SHAPE` error state |
| Empty response | Response/content validation | `EMPTY_RESPONSE` error state |
| Slow response | 30-second request timeout | Loading state with elapsed timer and cancel button |
| Network failure | Axios error handling | `NETWORK_ERROR` state with retry |
| Stale request | `AbortController` | Older request automatically cancelled |
| Invalid flashcards | Frontend structure validation | Invalid result rejected before rendering |
| Invalid quiz | Question/options/correct-answer validation | Invalid result rejected before rendering |

---

##  Structured AI Pipeline

```text
User Study Material
        │
        ▼
React Frontend
        │
        ▼
Express Backend
        │
        ▼
Groq API
        │
        ▼
LLM Structured Response
        │
        ▼
JSON Parsing
        │
        ▼
Schema Validation
        │
        ▼
Frontend Validation
        │
        ▼
React Interactive Components
        │
        ├── Summary
        ├── Takeaways
        ├── Flashcards
        └── Quiz
