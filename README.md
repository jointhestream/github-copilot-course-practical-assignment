# CourseHub – Full-Stack Learning Platform

A full-stack online course platform built with **ASP.NET Core Web API** (backend) and **React + TypeScript** (frontend).

## Repo Structure

```
/backend    – ASP.NET Core 9 Web API (EF Core + SQLite + JWT)
/frontend   – React + TypeScript (Vite) + React Router v6
```

## Running Locally

### Backend

```bash
cd backend/CourseHub.Api
dotnet restore
dotnet run
```

The API starts at **http://localhost:5000**.  
Swagger UI is available at http://localhost:5000/swagger during development.

On first run, migrations are applied automatically and seed data is created.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app starts at **http://localhost:5173**.

### Seeded Accounts

| Email          | Password    | Role  |
|----------------|-------------|-------|
| admin@local    | Admin123!   | Admin |
| user@local     | User123!    | User  |

## Features

- **Public:** Browse published courses, view course details with lessons
- **Auth:** Register, login, JWT-based authentication
- **User:** Enroll in courses, view enrolled courses, profile page
- **Admin:** Dashboard with stats, CRUD courses, manage lessons per course, publish/unpublish toggle
- **Layouts:** Main layout with top navbar, Admin layout with sidebar
- **Route Guards:** Protected routes for authenticated users and admin-only areas