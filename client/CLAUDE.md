# Client — React Frontend

## Architecture

- **Pages** (`src/pages/`) — one per route, registered in `App.jsx`
- **Components** (`src/components/`) — reusable UI, no page-specific logic
- **Hooks** (`src/hooks/`) — shared stateful logic
- **Services** (`src/services/`) — ALL API calls go here. Never call Axios from components.
- **Context** (`src/context/`) — global state (auth, theme)

## Registries

Before writing code: read `docs/components.md`, `docs/pages.md`, `docs/hooks.md`. Do not duplicate.
After ANY change (add, modify, delete, rename): update the matching registry + change log. Task isn't done until registry matches code.

## Security Rules

**ALWAYS follow these. No exceptions.**

### Input Handling
- NEVER use `dangerouslySetInnerHTML` unless content is sanitized with DOMPurify
- Validate all form inputs client-side before submission (email format, password strength, prompt length)
- Truncate and sanitize error messages from API responses before displaying (max 200 chars)
- Enforce password requirements in registration: min 8 chars, uppercase, lowercase, digit

### API & Data
- NEVER hardcode API keys, secrets, or tokens in client code
- ALL API calls must go through `services/api.js` — never raw fetch/axios in components
- Validate media URLs before rendering (must be relative paths starting with `/uploads/`)
- NEVER include sensitive data in URL query parameters

### Authentication
- Clear all auth state on logout (localStorage, context state)
- Handle 401 responses globally — redirect to login and clear token
- Disable form submit buttons during async operations to prevent double-submission
- NEVER store sensitive data in localStorage beyond the auth token

### XSS Prevention
- React auto-escapes JSX expressions — do NOT bypass this
- Validate any URLs before passing to `src`, `href`, or `action` attributes
- Sanitize any user-generated content before display
- Error messages from APIs are untrusted — always render as plain text

### Forms
- All forms must have proper `type` attributes on inputs
- Disable submit button while loading to prevent double-clicks
- Show clear validation errors before submission where possible
- Set `maxLength` on text inputs to match server limits

## Testing

- Framework: Vitest
- Test files: `__tests__/[ComponentName].test.jsx` mirroring the source structure
- Test user-facing behavior (renders, clicks, state changes), not implementation details
- Run `npm run test` before committing

## Key Rules

- All API calls through `src/services/` via a shared Axios instance (`src/services/api.js`)
- Tailwind for all styling — no custom CSS files
- Every page must be in `App.jsx` routes AND `docs/pages.md`
- Functional components only, named exports

## Component Checklist

1. ☐ Checked `docs/components.md` — no duplicate
2. ☐ Created or modified in correct directory
3. ☐ API calls go through `services/`
4. ☐ All inputs validated (length, format, type)
5. ☐ No XSS risks (no dangerouslySetInnerHTML, URLs validated)
6. ☐ Submit buttons disabled during loading
7. ☐ If page → route in `App.jsx` + `docs/pages.md` updated
8. ☐ `docs/components.md` or `docs/hooks.md` updated
9. ☐ `todo.md` updated
