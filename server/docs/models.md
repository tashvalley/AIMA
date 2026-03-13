# Database Model Registry

> **Read before creating/modifying any model. Update after ANY change. Run `npx prisma migrate dev` after schema changes.**

## Schema: `prisma/schema.prisma`

### Models

#### User
- **Status:** ✅ Active | **Added:** 2026-03-13 | **Modified:** 2026-03-13
- **Fields:**

  | Field     | Type     | Constraints          |
  |-----------|----------|----------------------|
  | id        | String   | @id @default(cuid()) |
  | email     | String   | @unique              |
  | name      | String   |                      |
  | password  | String   |                      |
  | createdAt | DateTime | @default(now())      |
  | updatedAt | DateTime | @updatedAt           |

- **Relations:** `contents Content[]`

#### Content
- **Status:** ✅ Active | **Added:** 2026-03-13 | **Modified:** 2026-03-13
- **Fields:**

  | Field         | Type          | Constraints              |
  |---------------|---------------|--------------------------|
  | id            | String        | @id @default(cuid())     |
  | type          | ContentType   | enum                     |
  | status        | ContentStatus | @default(PENDING)        |
  | prompt        | String        |                          |
  | generatedText | String?       | @db.Text                 |
  | mediaUrl      | String?       |                          |
  | mediaType     | String?       |                          |
  | aspectRatio   | String?       | e.g. "16:9", "9:16"     |
  | taskId        | String?       |                          |
  | errorMessage  | String?       |                          |
  | userId        | String        | FK -> User.id            |
  | createdAt     | DateTime      | @default(now())          |
  | updatedAt     | DateTime      | @updatedAt               |

- **Relations:** `user User` (onDelete: Cascade)
- **Indexes:** `@@index([userId])`

### Enums

#### ContentType
- **Values:** `POST`, `VIDEO`
- **Used by:** Content.type

#### ContentStatus
- **Values:** `PENDING`, `GENERATING`, `COMPLETED`, `FAILED`
- **Used by:** Content.status

## Change Log

| Date       | Action | Description                                    |
|------------|--------|------------------------------------------------|
| 2026-03-13 | ADD    | Created User model                             |
| 2026-03-13 | ADD    | Created Content model, ContentType/Status enums |
| 2026-03-13 | MODIFY | User — added contents relation                 |
| 2026-03-13 | MODIFY | Content — added aspectRatio field               |
