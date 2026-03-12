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

## Security Rules

**ALWAYS follow these. No exceptions.**

### Input Validation
- Validate ALL user input at the controller level before passing to services
- Enforce max length on strings (prompts: 10,000 chars, names: 200 chars, emails: 254 chars)
- Validate email format on registration/login
- Enforce password requirements: min 8 chars, must include uppercase, lowercase, and a digit
- Validate enum values against allowed lists (e.g., ContentType must be POST or VIDEO)
- Enforce pagination limits (max 100 per page)
- Set `express.json({ limit: '10mb' })` to prevent payload bombs

### Authentication & Secrets
- NEVER hardcode secrets — always use env vars
- Validate JWT_SECRET exists and is not the dev default on startup in production
- Use bcrypt with at least 10 salt rounds for passwords
- Return generic "Invalid credentials" on login failure — never reveal if email exists
- All protected routes must use the `auth` middleware

### Rate Limiting
- Auth endpoints (login, register): max 10 requests per 15 min per IP
- AI generation endpoints: max 20 requests per 15 min per user
- Use `express-rate-limit` middleware

### File Handling
- NEVER allow path traversal — validate all file paths resolve within `uploads/`
- Use `path.resolve()` and verify the result starts with the uploads directory
- Only allow whitelisted file extensions (.png, .jpg, .mp4)
- Set max file size limits on downloads (50MB)
- Use content IDs (cuid) for filenames — never user-supplied names

### Error Handling
- NEVER expose stack traces, file paths, or internal structure to clients
- Log detailed errors server-side only in development
- Always return generic "Internal server error" for unhandled 500s
- Catch and wrap all external API errors (Google AI, etc.) with safe messages

### Data Protection
- NEVER log passwords, tokens, API keys, or sensitive user data
- NEVER commit `.env` files
- NEVER return password hashes in API responses
- Use `select` in Prisma queries to exclude sensitive fields

### CORS & Headers
- Use helmet() for security headers
- Set explicit CORS origin — never use `*` with credentials
- Validate CLIENT_URL env var exists in production

## Testing

- Framework: Jest + Supertest
- Test files: `__tests__/[name].test.js` mirroring the source structure
- Every new or modified endpoint needs a test covering: success case, validation failure, and auth rejection (if protected)
- Run `npm test` before committing — broken tests block the commit

## Key Rules

- Async handlers must use try/catch
- Validate request bodies in controllers
- `/api/health` must exist, return `{ status: "ok" }`
- Never expose stack traces in production

## Endpoint Checklist

1. ☐ Checked `docs/apis.md` — no duplicate
2. ☐ Route + controller + service created (or modified)
3. ☐ Input validation added (length, format, type)
4. ☐ Rate limiting applied if auth or AI endpoint
5. ☐ Route registered in `app.js`
6. ☐ Test written/updated (`__tests__/`) — covers success, validation, auth
7. ☐ `docs/apis.md` updated (add, modify, or delete)
8. ☐ `todo.md` updated
