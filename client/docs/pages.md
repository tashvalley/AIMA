# Pages & Routes Registry

> **Read before creating/modifying any page. Update after ANY change. Every page needs a route in `App.jsx` AND a row here.**

| Route Path   | Page Component | File                       | Auth | Description                 | Status   | Added      |
|-------------|----------------|----------------------------|------|-----------------------------|----------|------------|
| `/`         | Dashboard      | `src/pages/Dashboard.jsx`  | Yes  | Dashboard with content stats | ✅ Active | 2026-03-13 |
| `/create`   | Create         | `src/pages/Create.jsx`     | Yes  | AI content generation (Post/Video) | ✅ Active | 2026-03-13 |
| `/history`  | History        | `src/pages/History.jsx`    | Yes  | Content history with filters | ✅ Active | 2026-03-13 |
| `/login`    | Login          | `src/pages/Login.jsx`      | No   | Login form                  | ✅ Active | 2026-03-13 |
| `/register` | Register       | `src/pages/Register.jsx`   | No   | Registration form           | ✅ Active | 2026-03-13 |
| `*`         | NotFound       | `src/pages/NotFound.jsx`   | No   | 404 catch-all               | ✅ Active | 2026-03-13 |

Auth: Yes routes wrapped in `<ProtectedRoute>`, redirects to `/login`.

All pages support dark mode.

## Change Log

| Date       | Action | Description                                  |
|------------|--------|----------------------------------------------|
| 2026-03-13 | ADD    | Created Dashboard, Login, Register, NotFound |
| 2026-03-13 | ADD    | Created Create, History pages                |
| 2026-03-13 | MODIFY | All pages — added dark mode support          |
| 2026-03-13 | MODIFY | Dashboard — added live content counts        |
