# Pages & Routes Registry

> **Read before creating/modifying any page. Update after ANY change. Every page needs a route in `App.jsx` AND a row here.**

| Route Path   | Page Component | File                       | Auth | Description                    | Status   | Added      |
|-------------|----------------|----------------------------|------|--------------------------------|----------|------------|
| `/`         | Landing        | `src/pages/Landing.jsx`    | No   | Public landing page (hero, features, CTA) | ✅ Active | 2026-03-13 |
| `/dashboard`| Dashboard      | `src/pages/Dashboard.jsx`  | Yes  | Dashboard with content stats   | ✅ Active | 2026-03-13 |
| `/create`   | Create         | `src/pages/Create.jsx`     | Yes  | AI content generation (Post/Video) | ✅ Active | 2026-03-13 |
| `/history`  | History        | `src/pages/History.jsx`    | Yes  | Content history with filters   | ✅ Active | 2026-03-13 |
| `/content/:id` | ContentDetail | `src/pages/ContentDetail.jsx` | Yes | Full view of single content item | ✅ Active | 2026-03-13 |
| `/login`    | Login          | `src/pages/Login.jsx`      | No   | Login form (standalone layout) | ✅ Active | 2026-03-13 |
| `/register` | Register       | `src/pages/Register.jsx`   | No   | Registration form (standalone layout) | ✅ Active | 2026-03-13 |
| `*`         | NotFound       | `src/pages/NotFound.jsx`   | No   | 404 catch-all                  | ✅ Active | 2026-03-13 |

**Route structure:**
- `/`, `/login`, `/register` — standalone (no app Layout wrapper)
- `/dashboard`, `/create`, `/history`, `/content/:id` — wrapped in `<ProtectedRoute><Layout /></ProtectedRoute>`
- Landing redirects to `/dashboard` if authenticated
- Login/Register redirect to `/dashboard` if authenticated

All pages support dark mode.

## Change Log

| Date       | Action | Description                                  |
|------------|--------|----------------------------------------------|
| 2026-03-13 | ADD    | Created Dashboard, Login, Register, NotFound |
| 2026-03-13 | ADD    | Created Create, History pages                |
| 2026-03-13 | MODIFY | All pages — added dark mode support          |
| 2026-03-13 | MODIFY | Dashboard — added live content counts        |
| 2026-03-13 | ADD    | Created Landing page                         |
| 2026-03-13 | MODIFY | Dashboard moved from `/` to `/dashboard`     |
| 2026-03-13 | MODIFY | Login/Register — standalone layout, redirect if authed |
| 2026-03-13 | MODIFY | All pages — full UI redesign (gradients, pill shapes, modern design) |
| 2026-03-13 | ADD    | Created ContentDetail page for full content view |
