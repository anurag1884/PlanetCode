# Software Requirements Specification (SRS)

## 1. Introduction
This document specifies the software requirements for PlanetCode, detailing functional and non-functional requirements.

## 2. Functional Requirements

### 2.1 Authentication & User Management
- The system MUST use Clerk for all user authentication.
- The system MUST map Clerk users to a local `User` table upon first login.
- The system MUST NOT implement custom user password authentication.

### 2.2 Planet (Room) Management
- A user MUST be able to create a Planet with a name and password.
- Planet passwords MUST be hashed using bcrypt and stored securely.
- Planet passwords MUST NEVER be returned to the client in plaintext or hash form.
- The owner MUST be able to manage access requests (Approve/Reject).
- The owner MUST be able to remove members, triggering immediate forced disconnection.

### 2.3 Real-time Collaboration
- The editor MUST support up to 5 concurrent active connections per Planet.
- The 6th concurrent connection attempt MUST be rejected atomically.
- The editor MUST synchronize document changes incrementally using Yjs.
- The editor MUST display remote user cursors and selections using Yjs Awareness.
- The client MUST automatically attempt reconnection upon network failure.

### 2.4 File Management
- Users MUST be able to create, read, update, and delete files within a Planet.
- The system MUST validate all file paths to prevent directory traversal.

## 3. Non-Functional Requirements (NFRs)

### 3.1 Performance
- WebSocket messages MUST be processed with minimal latency to ensure smooth real-time editing.
- The system MUST NOT transmit full file contents on every edit; it must use incremental updates.

### 3.2 Security
- All sensitive operations MUST verify the user's identity via Clerk and their membership status in the database.
- Input validation MUST be strictly enforced using Zod on all API endpoints and WebSocket messages.
- Secrets MUST NOT be leaked in logs, Git history, or client responses.

### 3.3 Reliability & Persistence
- Real-time document state MUST be persisted to PostgreSQL periodically and on server shutdown to prevent data loss.

## 4. Constraints
- **Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Monaco Editor, Clerk, Node.js (ws), PostgreSQL, Prisma, Yjs.
- **Infrastructure:** Single Next.js app for web, single Node.js process for realtime server (MVP). Redis is deferred.
