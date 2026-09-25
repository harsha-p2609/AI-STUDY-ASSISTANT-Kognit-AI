# Kognit AI | Interactive Study Assistant
> **Flam Frontend Internship Assignment** | AI-Powered Interactive Tool (Not a Chatbot)

> **Live Demo:** https://ai-study-assistant-kognit-ai.vercel.app/

Kognit AI turns notes or any study topic into a structured learning workspace. It uses the Groq API to generate summaries, flashcards, and quizzes, then presents them through an interactive React interface built for active recall.

> Learn actively. Review intentionally. Keep every workspace organized.

## How It Works

1. Enter notes, a textbook excerpt, or a topic.
2. Kognit AI validates the generated structured response.
3. Review the summary, flashcards, and quiz in one workspace.
4. Track progress and return to saved workspaces whenever you need them.

## Features

- Generate structured study material from notes or a topic.
- Review interactive flashcards with flip, mastery, filtering, keyboard navigation, and text-to-speech support.
- Check key takeaways and retest missed quiz questions.
- Export flashcards as a PDF study guide.
- Register or sign in with email/password or Google OAuth.
- Automatically save generated workspaces to MongoDB for authenticated users.
- Browse, reload, and delete saved workspaces.
- Keep separate accounts signed in independently in separate browser tabs.
- Handle malformed AI output, invalid schemas, timeouts, cancellations, and network failures with recovery states.

## Stack

- **Client:** React 18, Vite, Axios, Lucide React
- **Server:** Node.js, Express, Mongoose
- **Authentication:** JWT, bcrypt, Google OAuth 2.0
- **AI provider:** Groq chat completions API
- **Database:** MongoDB, with `mongodb-memory-server` as a local fallback

## Project Structure

```text
client/                         React + Vite frontend
  src/components/              UI and study assistant components
  src/context/                  Authentication state
  src/services/                 API client and result validation
server/                         Express backend
  controllers/                  AI, auth, and session logic
  middleware/                   Authentication middleware
  models/                       Mongoose models
  routes/                       API route definitions
  utils/                        Server-side validation helpers
```

## Requirements

- Node.js 18 or newer
- npm 9 or newer
- A Groq API key
- MongoDB for persistent storage, or the local in-memory fallback

## Local Setup

### 1. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Configure environment variables

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/kognit_ai
JWT_SECRET=replace_with_a_long_random_secret
GROQ_API_KEY=gsk_your_groq_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

For local development, `VITE_API_URL` may be omitted because Vite proxies `/api` requests to `http://localhost:5000`. For a deployed frontend, set it to the public backend URL, such as `https://api.example.com`.

### 3. Start the application

Run the backend in one terminal:

```bash
cd server
npm start
```

Run the frontend in another terminal:

```bash
cd client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Deployment

1. Deploy the `server` directory to a Node.js host.
2. Configure the server environment variables, including `GROQ_API_KEY`, `JWT_SECRET`, and `MONGODB_URI`.
3. Set the frontend `VITE_API_URL` to the deployed backend URL.
4. Set `VITE_GOOGLE_CLIENT_ID` to the Google OAuth client used by the backend.
5. Run `npm run build` in `client` and deploy the generated `client/dist` directory.
6. Configure the backend CORS policy to allow the deployed frontend origin.

Vite environment variables are embedded at build time. Rebuild the client after changing them.

## Available Scripts

### Client

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run preview   # Preview the production build locally
```

### Server

```bash
npm start         # Start the Express API
npm run dev       # Start the API with Node watch mode
```

## API Routes

| Method | Route | Purpose | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account | No |
| `POST` | `/api/auth/login` | Sign in with email/password | No |
| `POST` | `/api/auth/google` | Sign in with Google | No |
| `GET` | `/api/auth/me` | Get the current user | Yes |
| `POST` | `/api/ai/generate` | Generate and save study data | Optional |
| `GET` | `/api/sessions` | List saved workspaces | Yes |
| `GET` | `/api/sessions/:id` | Load a workspace | Yes |
| `PUT` | `/api/sessions/:id/progress` | Update learning progress | Yes |
| `DELETE` | `/api/sessions/:id` | Delete a workspace | Yes |
| `GET` | `/api/health` | Check server availability | No |

## Authentication and Saved Workspaces

Generated content is saved only when the request includes a valid authenticated user. The client stores the JWT in `sessionStorage`, so each browser tab can use a different account. Closing a tab ends that tab's stored login; sign in again when opening a new tab.

The Groq API key remains on the server and is never exposed to the browser. Session data is scoped to the authenticated user, so users can only access their own saved workspaces.

## Troubleshooting

- **Saved workspaces are empty:** Confirm that you are signed in and that `VITE_API_URL` points to the running backend. Rebuild the client after changing Vite environment variables.
- **AI generation fails:** Confirm `GROQ_API_KEY` is present and valid in `server/.env`.
- **Authentication fails:** Confirm `JWT_SECRET` is configured consistently and that Google client IDs match between client and server.
- **CORS or network errors:** Confirm the backend is reachable from the frontend and that the backend allows the deployed frontend origin.
