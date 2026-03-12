# Todo

> **Read at the start of every session. Update after completing or adding any task.**

## In Progress

<!-- | Task | Type | Started | Notes | -->

## Up Next

- [ ] Add Google AI API key to server/.env (GOOGLE_AI_API_KEY)
- [ ] Stripe billing integration
- [ ] User settings / profile page

## Done

| Task | Type | Completed | Commit |
|------|------|-----------|--------|
| Project skeleton (Vite + Express + Prisma + Docker) | feat | 2026-03-13 | — |
| Health check endpoint | feat | 2026-03-13 | — |
| User auth (register, login, me) | feat | 2026-03-13 | — |
| Dashboard page | feat | 2026-03-13 | — |
| Dark / light mode toggle | feat | 2026-03-13 | — |
| Content model + enums (Prisma) | feat | 2026-03-13 | — |
| AI content generation API (Google Gemini + Imagen + Veo) | feat | 2026-03-13 | — |
| Content CRUD endpoints (history, get, delete) | feat | 2026-03-13 | — |
| Create page (post + video generation UI) | feat | 2026-03-13 | — |
| History page (content list + filters) | feat | 2026-03-13 | — |
| Dashboard live content counts | feat | 2026-03-13 | — |

## Bugs

<!-- | Bug | Severity | Found | Notes | -->

## Notes

- Docker Postgres runs on port **5433** (5432 was taken by another project)
- Server runs on port **3002** (3001 was taken by another project)
- DATABASE_URL in server/.env uses port 5433
- Using Google AI (Gemini 2.0 Flash + Imagen 3 + Veo 2) — single API key
- Generated media saved to `server/uploads/` (gitignored)
- Stripe billing deferred
