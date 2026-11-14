# TikCalulaator Frontend

React + Vite + Tailwind frontend for the TikTok earnings calculator.

Live Website: [https://www.kalkulatortik.com](https://www.kalkulatortik.com)

## Getting started

```bash
cd frontend
npm install
npm run dev
```

Environment:

- `VITE_API_URL` base URL for the backend (default http://localhost:5000/api/v1)

## Scripts

- `npm run dev` start Vite dev server
- `npm run build` production build
- `npm run preview` preview build
- `npm run lint` lint JS/JSX
- `npm run test` run Vitest + React Testing Library snapshot

## Pages

- Home, Calculator, FAQ/How it works, About, Contact
- Calculator page calls backend estimate API, shows animated result card, and copies a shareable link.

## Deployment

- Vercel: set `VITE_API_URL` to your deployed backend. Build command `npm run build`, output `dist`.
- Any static host works as long as the API URL is configured and CORS allows the domain.

