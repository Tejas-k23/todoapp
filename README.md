# Timetable+ PWA

Timetable+ is a full-stack Progressive Web App built with React + Vite on the frontend and FastAPI + MongoDB on the backend. It now uses mobile-number OTP authentication on the frontend and exchanges the verified OTP response for an app JWT on the backend.

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

## OTP Configuration

Frontend env file: [frontend/.env](d:/gjapp/timetable-pwa/frontend/.env)

Required values:

- `VITE_API_URL`
- `VITE_MSG91_WIDGET_ID`
- `VITE_MSG91_TOKEN_AUTH`

The login and signup pages open the MSG91 OTP widget and then send the returned verification token to the backend.

## Notes

- This implementation assumes the MSG91 widget success callback is the source of truth for OTP verification.
- For higher-security production flows, add server-side verification against the OTP provider before issuing your JWT.
## Deployment Notes

- Frontend Vercel config: `frontend/vercel.json`
- Production frontend API URL: `https://todoapp-pk7k.onrender.com/api`
- Make sure the backend CORS env includes your final frontend domain in `FRONTEND_URL` and `FRONTEND_URLS`
