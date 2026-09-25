# Kognit AI — Interactive Study Assistant
> **Flam Frontend Internship Assignment** | AI-Powered Interactive Tool (Not a Chatbot)

Kognit AI is a full-stack web application that takes free-form text notes or topics, sends them to an LLM provider (Groq API), and converts unpredictable AI output into structured JSON data to drive rich, stateful React components: interactive 3D flip flashcards with audio read-aloud, formatted PDF exports, checkable concept takeaways, and knowledge quizzes with wrong-answer re-testing.

This application strictly avoids chatbot interfaces, ensuring raw model output is validated defensively before ever reaching the UI.

---

## 🎯 Core Features & Interactive UI

### 1. Free-Form Text Input
- Paste raw study notes, textbook excerpts, or enter any academic topic.
- Preset topic selectors for quick one-click testing.

### 2. Study Assistant Suite (Structured AI Output)
- **Topic Overview & Takeaways**: Conceptual summary with interactive, checkable key takeaway items.
- **Interactive 3D Flashcards**: 
  - Smooth 3D card flip animation (click card or press `Spacebar`).
  - **Audio Read-Aloud (Text-to-Speech)**: Built-in speaker button using browser-native Web Speech API to read questions, answers, and explanations aloud.
  - **Download PDF**: One-click PDF export generator formatted cleanly as a printable study guide.
  - **Mastery Tracking**: Mark cards as *Mastered* vs *Needs Review* with a live progress bar.
  - **Spaced Repetition Filtering**: Toggle between *All Cards* and *Needs Review Only* to focus on un-mastered questions.
  - **Keyboard Navigation**: `Left Arrow` / `Right Arrow` for card navigation, `Space` for flipping cards.
- **Knowledge Assessment Quiz**:
  - Question-by-question quiz with instant option feedback.
  - Final score breakdown and performance metrics.
  - **Re-Test Wrong Answers**: Dedicated feature that isolates missed questions for focused re-testing.

### 3. Authentication & Saved Workspaces
- **Google OAuth 2.0**: Native Google sign-in using `@react-oauth/google` and server-side token verification (`google-auth-library`).
- **JWT & Password Auth**: User registration and login backed by MongoDB and bcrypt password hashing.
- **Saved Workspaces**: Automatic saving of study decks to MongoDB with a slide-out session drawer to reload or delete past study decks.

---

## 🛡️ Defensive AI Output Handling & Error Recovery

A core requirement of this assignment is handling unpredictable AI output gracefully. Kognit AI implements a multi-layered defensive strategy:

| Failure Mode | How It Is Detected | Visible UI Recovery State |
| :--- | :--- | :--- |
| **Malformed JSON** | `JSON.parse` try/catch block catches raw text or syntax errors. | Displays `MALFORMED_JSON` error panel, raw response inspector, and explicit **Retry Prompt** button. |
| **Wrong Schema / Shape** | `schemaValidator.js` (backend) & `validateResult.js` (frontend) check for required arrays/fields. | Routes missing or corrupt fields to `INVALID_SCHEMA_SHAPE` error view without crashing the UI. |
| **Empty Response** | Checks for null or blank content returned from model choices. | Catches `EMPTY_RESPONSE` error and prompts the user to retry with a more descriptive prompt. |
| **Slow Response / Hang** | 30-second execution timeout guard via Axios/Fetch signal. | `LoadingState` shows live elapsed timer `({elapsed}s)` and a manual **Cancel Generation** button. |
| **Failed Network Request** | Catches 5xx status codes or unreachable server exceptions. | Shows `NETWORK_ERROR` notification with a clear retry trigger. |
| **Stale Responses** | Implements `AbortController` cancellation token on every new request. | Automatically aborts older in-flight requests when a newer request is started, preventing stale overwrites. |

---

## 🏗️ Technical Architecture & Key Protection

- **Frontend**: React (hooks, functional components), Vite, Vanilla CSS with custom design system tokens (dark & light theme support), Lucide React SVG icons.
- **Backend Proxy**: Node.js & Express API server.
- **API Key Security**: The Groq API key is stored securely in the server environment (`server/.env`) and is **never shipped to the client browser**. Frontend calls `/api/ai/generate`.
- **LLM Model**: Groq API using high-performance candidate models (`openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `qwen/qwen3.8-27b`) with automatic candidate model fallbacks.
- **Database**: MongoDB with Mongoose ORM (equipped with `mongodb-memory-server` for zero-config instant startup).

```
flam-frontend-assignment/
├── client/                      # React (Vite) Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── StudyAssistant/  # Flashcards, Quiz, Summary components
│   │   │   ├── ErrorState.jsx   # Shared error & retry UI
│   │   │   ├── LoadingState.jsx # Animated loader with request cancellation
│   │   │   ├── PromptInput.jsx  # Free-form input with sample presets
│   │   │   ├── Navbar.jsx       # Header with theme toggle & auth modal trigger
│   │   │   ├── SessionHistory.jsx # Saved Workspaces slide-out drawer
│   │   │   └── AuthModal.jsx    # Google OAuth & email login modal
│   │   ├── services/
│   │   │   ├── api.js           # Backend API client with AbortController guard
│   │   │   └── validateResult.js# Client-side defensive shape validator
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state & JWT token manager
│   │   ├── App.jsx              # Main workspace router & state
│   │   └── index.css            # Custom CSS design system tokens
│   └── package.json
├── server/                      # Node.js Express Backend Proxy
│   ├── controllers/
│   │   ├── aiController.js      # Strict LLM prompt & defensive parsing logic
│   │   └── authController.js    # JWT & Google OAuth verification controller
│   ├── utils/
│   │   └── schemaValidator.js   # Server-side structural schema validator
│   ├── routes/                  # Express API routes (/api/ai, /api/auth, /api/sessions)
│   ├── models/                  # Mongoose User & Session schemas
│   ├── server.js                # Express app entry point
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Configuration

The repository includes ready-to-run environment fallbacks. Optionally, configure your environment variables:

- `server/.env`:
  ```env
  PORT=5000
  JWT_SECRET=your_jwt_secret_key
  GROQ_API_KEY=gsk_your_groq_api_key
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret
  ```

- `client/.env`:
  ```env
  VITE_GOOGLE_CLIENT_ID=your_google_client_id
  ```

### 3. Run the Application

```bash
# Terminal 1: Start Backend API Server (Port 5000)
cd server
npm start

# Terminal 2: Start Frontend Development Server (Port 3000)
cd client
npm run dev
```

Open **`http://localhost:3000`** in your browser to view the application.

---

## ⏳ Time Spent & Known Limitations

### Time Spent
- **Estimated Development Time**: ~6.5 hours total (within the ~8-hour hard cap).

### Known Limitations
- **API Rate Limits**: The Groq free-tier API has rate limits (RPM/TPM); if exceeded, the app will catch the error and present a friendly retry message.
- **Context Length**: Text inputs exceeding ~4,000 words may reach token window constraints during structured JSON output generation.
