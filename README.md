# Production-Ready Full-Stack Todo SaaS

A scalable Todo application built with Next.js 14 + Express + MongoDB, including JWT auth, drag-and-drop todos, optimistic UI, security hardening, Docker, Swagger docs, and seed/test setup.

## Monorepo Structure

```
.
├── frontend
│   ├── app
│   ├── components
│   ├── features
│   ├── lib
│   └── store
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── docs
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   ├── scripts
│   │   ├── services
│   │   ├── utils
│   │   └── validators
│   └── tests
└── docker-compose.yml
```

## Features

- Authentication: register/login/logout/refresh/me via HTTP-only cookies
- CSRF: double-submit cookie pattern (`csrfToken` cookie + `x-csrf-token` header)
- Todos: create, update, soft delete, complete toggle, due date, priority, tags, drag-drop reorder
- Querying: search/filter/pagination
- Dashboard stats: total/completed/pending/overdue
- Optimistic UI with rollback on error
- Security: helmet, CORS, rate limiting, Mongo sanitization, XSS cleaning, HPP
- Observability: Winston logging + health endpoint
- API docs: Swagger at `/api/docs`
- Backend test scaffold: Jest + Supertest
- Seed data script

## Local Setup

1. Copy env files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Install dependencies:

```bash
npm install
npm run install:all
```

3. Start MongoDB (Docker) and run apps:

```bash
docker compose up -d mongo
npm run dev
```

4. Seed sample user/todos:

```bash
npm run seed --workspace backend
```

## Docker (Full Stack)

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`
- Swagger: `http://localhost:5000/api/docs`

## Test

```bash
npm run test --workspace backend
```

## Deployment Notes

- Set strong JWT/CSRF secrets in production.
- Keep `secure` cookies enabled behind HTTPS.
- Set `FRONTEND_URL` to exact production UI origin.
- Use managed MongoDB and rotate secrets regularly.
