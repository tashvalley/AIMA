# Component Registry

> **Read before creating/modifying any component. Update after ANY change.**

### Layout Components

| Component | File                        | Props | Description                                  | Status   | Added      |
|-----------|-----------------------------|-------|----------------------------------------------|----------|------------|
| Layout    | `src/components/Layout.jsx` | —     | Floating pill nav + mobile bottom nav + Outlet | ✅ Active | 2026-03-13 |

### UI Components

| Component      | File                                | Props      | Description                              | Status   | Added      |
|----------------|-------------------------------------|------------|------------------------------------------|----------|------------|
| ProtectedRoute | `src/components/ProtectedRoute.jsx` | `children` | Redirects to /login if not authenticated | ✅ Active | 2026-03-13 |

### Feature Components

| Component   | File                                | Props                | Used In | Status   | Added      |
|-------------|-------------------------------------|----------------------|---------|----------|------------|
| ContentCard | `src/components/ContentCard.jsx`    | `content, onDelete`  | History | ✅ Active | 2026-03-13 |

## Change Log

| Date       | Action | Description                                |
|------------|--------|--------------------------------------------|
| 2026-03-13 | ADD    | Created Layout, ProtectedRoute             |
| 2026-03-13 | ADD    | Created ContentCard                        |
| 2026-03-13 | MODIFY | Layout — added dark mode toggle + nav links |
| 2026-03-13 | MODIFY | Layout — redesigned with floating pill nav, mobile bottom nav, glass effect |
| 2026-03-13 | MODIFY | ContentCard — redesigned with gradient hover effects, improved badges |
| 2026-03-13 | MODIFY | ProtectedRoute — updated spinner style     |
