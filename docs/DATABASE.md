# Database Design

## 1. Overview
The database uses PostgreSQL managed via Prisma. It stores users, planets, memberships, files, and Yjs document snapshots.

## 2. ER Diagram
```mermaid
erDiagram
    User ||--o{ Planet : owns
    User ||--o{ PlanetMember : has
    User ||--o{ AccessRequest : requests
    Planet ||--o{ PlanetMember : contains
    Planet ||--o{ AccessRequest : receives
    Planet ||--o{ File : contains
    Planet ||--o{ DocumentSnapshot : stores

    User {
        String id PK
        String clerkId UK
        String email UK
    }
    Planet {
        String id PK
        String planetCode UK
        String passwordHash
        String ownerId FK
    }
    PlanetMember {
        String id PK
        String planetId FK
        String userId FK
        Enum role
        Enum status
    }
    AccessRequest {
        String id PK
        String planetId FK
        String userId FK
        Enum status
    }
    File {
        String id PK
        String planetId FK
        String path
        String content
    }
    DocumentSnapshot {
        String id PK
        String planetId FK
        Bytes state
    }
```

## 3. Key Models & Constraints
- **User:** Maps `clerkId` to a local `id`.
- **Planet:** Contains the bcrypt `passwordHash`.
- **PlanetMember:** Enforces a unique constraint on `(planetId, userId)`. `status` (ACTIVE/REMOVED) dictates access.
- **AccessRequest:** Enforces a unique constraint on `(planetId, userId)` for pending requests.
- **File:** Enforces a unique constraint on `(planetId, path)` to prevent duplicate paths.
- **DocumentSnapshot:** Stores the binary `Y.encodeStateAsUpdate()` payload for persistence.
