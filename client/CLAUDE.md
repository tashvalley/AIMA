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
4. ☐ If page → route in `App.jsx` + `docs/pages.md` updated
5. ☐ `docs/components.md` or `docs/hooks.md` updated
6. ☐ `todo.md` updated
