# 📚 Study Buddy Tutor

AI-powered tutor that explains engineering topics using persona-based explanations — built with React, Express, and Claude.

---

## Project Structure

```
study-buddy/
├── package.json            ← root scripts (runs both client + server)
├── .env.example
├── .gitignore
├── server/
│   ├── package.json
│   └── index.js            ← Express API proxy (streaming, OpenAI fallback)
└── client/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx             ← root state + orchestration
        ├── index.css           ← design tokens + global styles
        ├── constants.js        ← personas, levels, sample topics
        ├── prompts.js          ← system prompt builders + response parser
        ├── api.js              ← streaming fetch utility
        └── components/
            ├── Sidebar.jsx     ← persona selector + level picker
            ├── ChatPanel.jsx   ← scrollable conversation area
            ├── Message.jsx     ← single chat message bubble
            ├── QuizCard.jsx    ← check-for-understanding + answer flow
            ├── InputBar.jsx    ← topic input + send button
            ├── EmptyState.jsx  ← first-load prompt chips
            └── ThinkingDots.jsx
```

---

## Quick Start

### 1. Clone & install

```bash
git clone <your-repo>
cd study-buddy
npm run install:all
```

### 2. Add your API key

```bash
cp .env.example server/.env
# Edit server/.env and add your key:
#   ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Run

```bash
npm run dev
```

- Frontend: http://localhost:5173  
- Backend:  http://localhost:3001

---

## Environment Variables

### `server/.env`

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ Primary | Claude API key |
| `OPENAI_API_KEY` | Optional | Fallback if Claude key missing |
| `PORT` | Optional | Server port (default: 3001) |

### `client/.env`

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3001` | Backend URL |

---

## Features

- **3 Personas**: Friendly Mentor (cricket analogies), Strict Professor (technical), Visual Thinker (metaphors)
- **Streaming responses**: Text streams in real-time as Claude generates
- **Quiz mode**: Each explanation ends with a conceptual question; Claude evaluates your answer
- **Iteration controls**: "Simpler", "More technical", "New analogy" buttons after each explanation
- **OpenAI fallback**: If no Claude key, automatically falls back to GPT-4o

---

## Deployment

### Frontend (Vercel / Netlify)

```bash
cd client && npm run build
# Deploy the client/dist/ folder
# Set VITE_API_URL to your deployed server URL
```

### Backend (Railway / Render / Fly.io)

```bash
cd server
# Set ANTHROPIC_API_KEY as an environment variable
# Start: node index.js
```

---

## Converting to a Browser Extension

1. `cd client && npm run build`
2. Create `manifest.json` (Manifest V3):
   ```json
   {
     "manifest_version": 3,
     "name": "Study Buddy Tutor",
     "version": "1.0",
     "action": { "default_popup": "index.html" },
     "permissions": []
   }
   ```
3. Copy `manifest.json` into `client/dist/`
4. Load `client/dist/` as an unpacked extension in `chrome://extensions`

> Note: For the extension, point `VITE_API_URL` to your deployed backend URL before building.

## Converting to Mobile (React Native)

- Copy `constants.js`, `prompts.js`, and `api.js` directly — they are pure JS
- Replace JSX components with React Native equivalents (`View`, `Text`, `TextInput`, `ScrollView`, `Pressable`)
- Use `expo-fetch` or the built-in `fetch` for streaming (Expo SDK 50+)
