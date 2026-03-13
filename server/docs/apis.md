# API Endpoint Registry

> **Read before creating/modifying any endpoint. Update after ANY change.**

## Base URL: `/api`

### Health

| Method | Endpoint       | Description  | Auth | Request Body | Response            | Controller | Status   | Added      |
|--------|---------------|-------------|------|-------------|---------------------|-----------|----------|------------|
| GET    | `/api/health` | Health check | No   | —           | `{ status: "ok" }` | —         | ✅ Active | 2026-03-13 |

### Auth

| Method | Endpoint             | Description       | Auth | Request Body                | Response                                 | Controller              | Status   | Added      |
|--------|---------------------|-------------------|------|-----------------------------|------------------------------------------|-------------------------|----------|------------|
| POST   | `/api/auth/register` | Register new user | No   | `{ name, email, password }` | `{ success, data: { token, user } }`     | authController.register | ✅ Active | 2026-03-13 |
| POST   | `/api/auth/login`    | Login             | No   | `{ email, password }`       | `{ success, data: { token, user } }`     | authController.login    | ✅ Active | 2026-03-13 |
| GET    | `/api/auth/me`       | Get current user  | Yes  | —                           | `{ success, data: { id, email, name } }` | authController.me       | ✅ Active | 2026-03-13 |

### Content

| Method | Endpoint                     | Description          | Auth | Request Body    | Response                                      | Controller                   | Status   | Added      |
|--------|------------------------------|----------------------|------|-----------------|-----------------------------------------------|------------------------------|----------|------------|
| POST   | `/api/content/generate-post` | Generate post (img+text) | Yes  | `{ prompt, aspectRatio? }` | `{ success, data: Content }`             | contentController.generatePost  | ✅ Active | 2026-03-13 |
| POST   | `/api/content/generate-video`| Generate video (vid+text) | Yes  | `{ prompt, withAudio?, aspectRatio? }` | `{ success, data: Content }`  | contentController.generateVideo | ✅ Active | 2026-03-13 |
| GET    | `/api/content/history`       | List user content    | Yes  | —               | `{ success, data: { contents, total, page } }`| contentController.getHistory    | ✅ Active | 2026-03-13 |
| GET    | `/api/content/:id`           | Get single content   | Yes  | —               | `{ success, data: Content }`                  | contentController.getById       | ✅ Active | 2026-03-13 |
| GET    | `/api/content/:id/download`  | Download media file  | Yes  | —               | Binary file (Content-Disposition: attachment)  | contentController.download      | ✅ Active | 2026-03-13 |
| DELETE | `/api/content/:id`           | Delete content       | Yes  | —               | `{ success, message }`                        | contentController.delete        | ✅ Active | 2026-03-13 |

Query params for `/api/content/history`: `type` (POST|VIDEO), `page` (default 1), `limit` (default 20)

## Change Log

| Date       | Action | Description                                |
|------------|--------|--------------------------------------------|
| 2026-03-13 | ADD    | Created /api/health                        |
| 2026-03-13 | ADD    | Created /api/auth (register, login, me)    |
| 2026-03-13 | ADD    | Created /api/content (generate, history, CRUD) |
| 2026-03-13 | ADD    | Added /api/content/:id/download for media file download |
| 2026-03-13 | MODIFY | generate-post/video: added aspectRatio param (image: 1:1/3:4/4:3/9:16/16:9, video: 16:9/9:16) |
