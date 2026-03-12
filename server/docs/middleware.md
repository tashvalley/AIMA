# Middleware Registry

> **Read before creating/modifying any middleware. Update after ANY change.**

### Global (all routes in `app.js`)

| Middleware   | Source                          | Purpose            | Status   |
|-------------|---------------------------------|--------------------|----------|
| helmet      | npm                             | Security headers   | ✅ Active |
| cors        | npm                             | Cross-origin       | ✅ Active |
| morgan      | npm                             | Request logging    | ✅ Active |
| json parser | `express.json()`                | Parse JSON bodies  | ✅ Active |
| static      | `express.static('uploads')`     | Serve uploaded media | ✅ Active |
| errorHandler| `src/middleware/errorHandler.js` | Global error catch | ✅ Active |

### Route-Level

#### auth
- **File:** `src/middleware/auth.js`
- **Purpose:** JWT token verification — extracts userId from Bearer token
- **Used on:** `GET /api/auth/me`, all `/api/content/*` routes
- **Status:** ✅ Active | **Added:** 2026-03-13 | **Modified:** 2026-03-13

## Change Log

| Date       | Action | Description                                     |
|------------|--------|-------------------------------------------------|
| 2026-03-13 | ADD    | Created auth middleware                          |
| 2026-03-13 | MODIFY | auth — now also used on /api/content routes      |
| 2026-03-13 | ADD    | Added static file serving for /uploads           |
