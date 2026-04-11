# Timetable+ PWA

Timetable+ is a full-stack Progressive Web App built with React + Vite on the frontend and FastAPI + MongoDB on the backend. It uses a simple name + password login with JWT sessions.

## Project Structure

```text
timetable-pwa/
|- frontend/
|- backend/
`- README.md
```

## Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB Atlas connection string or local MongoDB

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

The API runs at `http://localhost:8000` and docs at `http://localhost:8000/docs`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Configuration

Frontend env file: `frontend/.env`

Required values:

- `VITE_API_URL`
## Deployment Notes

- Frontend Vercel config: `frontend/vercel.json`
- Production frontend API URL: `https://todoapp-pk7k.onrender.com/api`
- Make sure the backend CORS env includes your final frontend domain in `FRONTEND_URL` and `FRONTEND_URLS`
