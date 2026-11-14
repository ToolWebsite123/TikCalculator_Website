# TikCalulaator

Full-stack TikTok earnings calculator with React/Tailwind frontend and Express + MongoDB backend.

Live Website: [https://www.kalkulatortik.com](https://www.kalkulatortik.com)

## Quick start

```bash
cd backend && npm install && npm run seed && npm run dev   # API on 5000
cd ../frontend && npm install && npm run dev              # Vite on 5173
```

Set MongoDB (Atlas recommended). Example Atlas URI:
`mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/tikcalulaator`

## Structure

- `frontend/` React + Tailwind app (Vite)
- `backend/` Express API with Mongoose, calculator logic, seeding
- `docker-compose.yml` optional local stack with MongoDB + API

## Deployment

- Frontend: deploy `frontend` to Vercel; set `VITE_API_URL` to deployed backend.
- Backend: deploy `backend` to Railway/Render/Heroku; set `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`.

For detailed setup, see service READMEs in `frontend/` and `backend/`.

