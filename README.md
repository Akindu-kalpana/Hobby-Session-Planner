# Hobby Session Planner

A web app to organize hobby sessions like football practice, board games, or choir rehearsals.

## Features

- Create and manage sessions
- Join sessions and get attendance codes
- Search and filter sessions
- View session locations on a map
- Get AI-suggested session ideas
- Public and private sessions

## Technology

**Backend:**
- Node.js + Express
- SQLite database

**Frontend:**
- React (Vite)
- React Router
- Leaflet (maps)

## Setup

### Backend

```bash
cd backend
npm install
npm start
```

Runs on: http://localhost:5000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on: http://localhost:5173

### Environment Variables

Create `backend/.env`:
```
OPENAI_API_KEY=your-key-here
```

## How to Use

**Create a Session:**
1. Click "Create"
2. Fill the form
3. Save your management code

**Join a Session:**
1. Go to session details
2. Enter your name
3. Save your attendance code

**Manage/Leave:**
- Use management code to edit/delete sessions
- Use attendance code to leave sessions

## API Endpoints

- `GET /api/sessions` - Get all sessions
- `POST /api/sessions` - Create session
- `GET /api/sessions/:id` - Get session details
- `POST /api/attendance/join` - Join session
- `DELETE /api/attendance/leave` - Leave session
- `POST /api/ai/suggest` - Get AI suggestion

## Notes

- AI suggestions use mock data (real OpenAI code is commented in `backend/routes/ai.js`)
- Maps work best with coordinates: `latitude,longitude` format
- Don't push `.env` file to GitHub

