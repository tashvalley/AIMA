# Project: [APP_NAME]

React 18 + Vite frontend, Express.js API backend, PostgreSQL (Docker local / Railway prod), Prisma ORM. Deployed to Railway via CLI or GitHub auto-deploy.

## Project Structure

```
/
├── client/
│   ├── src/
│   │   ├── components/        # Reusable UI
│   │   ├── pages/             # Route-level components
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API calls (Axios)
│   │   ├── context/           # Global state
│   │   └── utils/
│   ├── CLAUDE.md
│   └── docs/
│       ├── components.md
│       ├── pages.md
│       └── hooks.md
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── config/
│   │   └── app.js
│   ├── prisma/schema.prisma
│   ├── server.js
│   ├── CLAUDE.md
│   └── docs/
│       ├── apis.md
│       ├── models.md
│       └── middleware.md
├── todo.md
├── docker-compose.yml
└── CLAUDE.md                  # ← YOU ARE HERE
```

## Local PostgreSQL (Docker)

```bash
docker compose up -d                  # Start
docker compose down                    # Stop
docker compose down -v                 # Wipe + restart
```

First time: `cd server && npx prisma migrate dev && npx prisma generate`

## Environment Variables

| Variable        | Where        | Required | Default                  | Description                   |
|----------------|-------------|----------|--------------------------|-------------------------------|
| `DATABASE_URL` | server `.env`| Yes      | `postgresql://postgres:postgres@localhost:5432/appdb?schema=public` | Postgres connection (auto-injected by Railway in prod) |
| `PORT`         | server `.env`| No       | `3001`                   | Server port (Railway auto-assigns in prod) |
| `NODE_ENV`     | server `.env`| Yes      | `development`            | `development` or `production` |
| `CLIENT_URL`   | server `.env`| Yes      | `http://localhost:5173`  | Frontend URL for CORS         |
| `JWT_SECRET`   | server `.env`| Yes      | —                        | Auth token signing key        |
| `JWT_EXPIRES_IN`| server `.env`| No      | `7d`                     | Token expiry duration         |
| `VITE_API_URL` | client `.env`| Yes      | `http://localhost:3001`  | Backend URL for API calls     |

In code: server uses `process.env.PORT || 3001`. Client uses `import.meta.env.VITE_API_URL`.

## Registry System

**Before creating anything:** read the matching registry. If it exists, reuse or extend — do NOT duplicate.
**After ANY change (add, modify, delete, rename):** update the matching registry immediately.
**The task is NOT done until the registry matches the code.**

| What changed             | Update this file             |
|-------------------------|------------------------------|
| API endpoint            | `server/docs/apis.md`        |
| Database model / enum   | `server/docs/models.md`      |
| Middleware              | `server/docs/middleware.md`  |
| React component         | `client/docs/components.md`  |
| Page / route            | `client/docs/pages.md`       |
| Custom hook             | `client/docs/hooks.md`       |

## Markdown File Rules

Use existing docs files. Do NOT create new `.md` files when the info fits in one above or in `todo.md`. If you must create a temp file (`plan.md`, `scratch.md`), delete it when done — never commit it.

## Workflow

1. Read `todo.md`
2. For 3+ file features → plan first, no code until approved
3. Check registries → implement → update registries → update `todo.md`
4. Delete any temp files
5. Test → `git add -A && git commit -m "type: description"` → `git push origin main`
6. `railway up` (or auto-deploy) → `railway logs`

Commit types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`

## Railway

Server must expose `/api/health` returning 200. Railway auto-provides `DATABASE_URL` and `PORT` when services are linked.

## Critical Rules

- NEVER commit `.env` or `push --force` on main
- NEVER skip registry updates
- NEVER leave temp `.md` files in the project
- Always start Docker before running server locally
- When compacting, preserve: registries, todo.md, current feature, errors, env var names
