# Server — Express.js Backend

## Architecture

Route → Controller → Service. Always.
- **Routes** — define endpoints + attach middleware. No logic.
- **Controllers** — parse request, call service, send response. No direct DB calls.
- **Services** — business logic + Prisma queries. No `req`/`res` objects.

## Registries

Before writing code: read `docs/apis.md`, `docs/models.md`, `docs/middleware.md`. Do not duplicate.
After ANY change (add, modify, delete, rename): update the matching registry + change log. Task isn't done until registry matches code.

## Response Format

```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "Human-readable message" }
```

## Testing

- Framework: Jest + Supertest
- Test files: `__tests__/[name].test.js` mirroring the source structure
- Every new or modified endpoint needs a test covering: success case, validation failure, and auth rejection (if protected)
- Run `npm test` before committing — broken tests block the commit

## Key Rules

- ES modules only
- Async handlers must use try/catch or `asyncHandler` wrapper from `src/middleware/asyncHandler.js`
- Validate request bodies in middleware, not controllers
- `/api/health` must exist, return `{ status: "ok" }`
- Never expose stack traces in production

## Endpoint Checklist

1. ☐ Checked `docs/apis.md` — no duplicate
2. ☐ Route + controller + service created (or modified)
3. ☐ Validation middleware if needed
4. ☐ Route registered in `app.js`
5. ☐ Test written/updated (`__tests__/`) — covers success, validation, auth
6. ☐ `docs/apis.md` updated (add, modify, or delete)
7. ☐ `todo.md` updated
