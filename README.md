# ReleaseCheck — Release Checklist Tool

A modern web application that helps developers track their release process through a structured checklist.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4
- **Backend:** Spring Boot 4 (Java 17) + JPA + PostgreSQL
- **Deployment:** Docker Compose (PostgreSQL + Backend + Frontend via Nginx)

## Prerequisites

- Java 17+
- Node.js 20+
- Docker & Docker Compose (optional, for containerized deployment)
- PostgreSQL 16+ (if not using Docker)

## Running Locally

### 1. Start PostgreSQL

```bash
docker compose up -d postgres
```

Or use your own PostgreSQL instance and update `Backend/src/main/resources/application.properties`.

### 2. Start the Backend

```bash
cd Backend
./mvnw spring-boot:run
```

The API runs at `http://localhost:8080`.

### 3. Start the Frontend

```bash
cd Frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` (proxies API requests to the backend).

### Or Run Everything with Docker Compose

```bash
docker compose up --build
```

This starts PostgreSQL, the backend API, and the frontend (served via Nginx) all together.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/releases` | List all releases (ordered by date descending) |
| `GET` | `/api/releases/{id}` | Get a single release by ID |
| `POST` | `/api/releases` | Create a new release |
| `PUT` | `/api/releases/{id}` | Update release name, date, and additional info |
| `PATCH` | `/api/releases/{id}/steps/{stepIndex}` | Toggle a checklist step (0-6) |
| `DELETE` | `/api/releases/{id}` | Delete a release |

### Create Release — Request Body

```json
{
  "name": "Version 2.0.0",
  "date": "2025-05-01T00:00:00",
  "additionalInfo": "Major release with new features"
}
```

### Update Release — Request Body

```json
{
  "name": "Version 2.0.1",
  "date": "2025-05-15T00:00:00",
  "additionalInfo": "Updated notes"
}
```

### Response — Release Object

```json
{
  "id": 1,
  "name": "Version 2.0.0",
  "date": "2025-05-01T00:00:00",
  "status": "PLANNED",
  "additionalInfo": "Major release with new features",
  "completedSteps": 0,
  "createdAt": "2025-04-26T10:00:00",
  "updatedAt": "2025-04-26T10:00:00"
}
```

**Status values:** `PLANNED` (no steps done), `ONGOING` (some steps done), `DONE` (all steps done). Status is computed automatically from `completedSteps`.

**completedSteps** is a bitmask integer — bit `i` set means checklist step `i` is completed.

## Database Schema

### Table: `releases`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Auto-incrementing ID |
| `name` | VARCHAR(255) | NOT NULL | Release name (e.g. "Version 1.0.0") |
| `date` | TIMESTAMP | NOT NULL | Release due date |
| `status` | VARCHAR(255) | NOT NULL | `PLANNED`, `ONGOING`, or `DONE` |
| `additional_info` | TEXT | NULLABLE | Free-form notes for the release |
| `completed_steps` | INTEGER | NOT NULL | Bitmask of completed checklist steps (0-6) |
| `created_at` | TIMESTAMP | NOT NULL | Record creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL | Last update timestamp |

### Checklist Steps (fixed, not stored in DB)

| Index | Step |
|-------|------|
| 0 | All relevant GitHub pull requests have been merged |
| 1 | CHANGELOG.md file has been updated |
| 2 | All tests are passing |
| 3 | Release in GitHub created |
| 4 | Deployed in demo |
| 5 | Tested thoroughly in demo |
| 6 | Deployed in production |

## Project Structure

```
├── Backend/                 # Spring Boot API
│   ├── src/main/java/com/tool/release_cheklist/
│   │   ├── config/         # CORS, exception handling
│   │   ├── entity/         # JPA entity (Release)
│   │   ├── repository/     # Spring Data JPA repository
│   │   ├── service/        # Business logic
│   │   └── controller/     # REST controller
│   ├── src/main/resources/application.properties
│   ├── Dockerfile
│   └── pom.xml
├── Frontend/               # React + Vite + Tailwind
│   ├── src/
│   │   ├── api/           # API client (fetch wrapper)
│   │   ├── components/    # React components
│   │   │   ├── Layout.tsx
│   │   │   ├── ReleasesList.tsx
│   │   │   ├── ReleaseDetail.tsx
│   │   │   ├── CreateRelease.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── Dockerfile.frontend
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yaml     # Full stack orchestration
└── README.md
```
