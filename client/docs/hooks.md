# Custom Hooks Registry

> **Read before creating/modifying any hook. Update after ANY change.**

### Hooks

#### useAuth
- **File:** `src/hooks/useAuth.js`
- **Purpose:** Access auth context (user, login, register, logout, loading)
- **Params:** —
- **Returns:** `{ user, loading, login, register, logout }`
- **Used in:** Layout, ProtectedRoute, Login, Register, Dashboard
- **Status:** ✅ Active | **Added:** 2026-03-13 | **Modified:** —

#### useTheme
- **File:** `src/hooks/useTheme.js`
- **Purpose:** Access theme context (dark/light mode toggle)
- **Params:** —
- **Returns:** `{ theme, toggleTheme }`
- **Used in:** Layout
- **Status:** ✅ Active | **Added:** 2026-03-13 | **Modified:** —

## Change Log

| Date       | Action | Description          |
|------------|--------|----------------------|
| 2026-03-13 | ADD    | Created useAuth hook |
| 2026-03-13 | ADD    | Created useTheme hook |
