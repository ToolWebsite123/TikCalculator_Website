# TikCalulaator Backend

Express + MongoDB API that powers the TikTok earnings calculator.

## Getting started

```bash
cd backend
npm install
cp .env.example .env   # fill values
npm run dev            # or npm start
```

Environment variables:

- `MONGO_URI` MongoDB connection string (Atlas recommended)
- `PORT` API port (default 5000)
- `JWT_SECRET` secret for admin JWTs
- `FRONTEND_URL` comma-separated origins for CORS (e.g., https://www.kalkulatortik.com,http://localhost:5173)
- `SCRAPER_USER_AGENT` (optional) custom UA for TikTok scraping
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` credentials seeded for `/admin/login`

### Earnings Calculation Environment Variables

The earnings endpoint (`GET /api/tiktok/user/:username/earnings`) uses these optional environment variables:

- `DEFAULT_CPM` - Default CPM (Cost Per Mille) in USD. Default: `5.00`
- `PLATFORM_FACTOR` - Platform factor multiplier (0.0 to 1.0). Default: `0.8` (80%)
- `POSTS_PER_MONTH` - Default number of posts per month for monthly earnings calculation. Default: `20`

**Example `.env` configuration:**
```env
DEFAULT_CPM=5.00
PLATFORM_FACTOR=0.8
POSTS_PER_MONTH=20
```

**How to change these values:**
1. Open your `.env` file in the backend directory
2. Add or modify the variables above
3. Restart the backend server for changes to take effect

**Calculation Formula:**
- `earningsPerVideo = (avgViews / 1000) × DEFAULT_CPM × PLATFORM_FACTOR`
- `earningsMonthly = earningsPerVideo × POSTS_PER_MONTH`

## Scripts

- `npm run dev` start with nodemon
- `npm start` start production server
- `npm run seed` populate country CPMs + admin user
- `npm test` run Jest unit tests
- `node test-earnings.js` test the earnings endpoint (requires server running)

## API

Base URL: `/api/v1` (also available under `/api` for TikTok routes)

### TikTok Endpoints

- `GET /api/tiktok/user/:username` - Get TikTok profile with earnings (full response)
- `GET /api/tiktok/user/:username/earnings` - Get dedicated earnings calculation
  - Returns: `{ success, username, avgViews, engagementRate, cpm, platformFactor, earningsPerVideo, earningsMonthly, source, raw }`
  - Query params: `?refresh=true` to force refresh cache
  - Cache: 60 seconds (in-memory)

### Other Endpoints

- `GET /health` simple health check
- `POST /calc/estimate` body `{ viewsPerVideo, videosPerMonth, cpm?, countryCode?, platformShare?, nicheMultiplier? }` → `{ perVideo, monthly, breakdown, formatted, meta }`
- `GET /countries` → list `{ code, name, defaultCpm }`
- `POST /save` body `{ email?, inputs, result }` → saved calculation with `_id`
- `GET /saved/:id` → saved calculation
- `POST /admin/login` body `{ email, password }` → `{ token }`

OpenAPI-style sketch:

```yaml
/calc/estimate:
  post:
    summary: Estimate earnings
    requestBody:
      content:
        application/json:
          schema:
            viewsPerVideo: number
            videosPerMonth: number
            cpm: number
            countryCode: string
            platformShare: number
            nicheMultiplier: number
    responses:
      200: { perVideo: number, monthly: number, breakdown: object }
/countries:
  get: { responses: { 200: [{ code, name, defaultCpm }] } }
/save:
  post: { responses: { 201: SavedCalculation } }
/saved/{id}:
  get: { responses: { 200: SavedCalculation } }
/admin/login:
  post: { responses: { 200: { token: string } } }
```

## Security & middleware

- CORS (origins from `FRONTEND_URL`)
- Helmet security headers
- Rate limiting (100 req/15m)
- Central error handler

## Seeding

`npm run seed` upserts CPM presets (US, UK, IN, PK) and an admin user from env. Rerun safely anytime.

## Deployment

- Railway/Render/Heroku: set env vars above, enable persistent MongoDB (Atlas recommended). Expose port from `PORT`.
- Allow CORS for the deployed frontend domain.

### Docker (optional)

```bash
docker build -t tikcalulaator-api .
docker run -p 5000:5000 --env-file .env tikcalulaator-api
```

See root `docker-compose.yml` for a local example with MongoDB.

