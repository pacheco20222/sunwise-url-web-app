# 🧩 SRS_Backend_URL_Shortener_v1.0.md
**Author:** Pacheco  
**Date:** 2025-10-26  
**Agent Rule (critical):** **Do not create files or run commands.** Always **show code and commands in chat**, explain **what** and **why**, and you will only be able to apply code if you are given permission to or execute commands if you are given permission to.

---

## 0) Final Decisions (based on your inputs)
1) **Database:** **PostgreSQL** (via Docker Compose).  
2) **Upload limits:** **5 MB** max per `.txt` upload; max **1000 URLs** per upload.  
3) **Processing model:**  
   - Single-URL shorten/redirect: **synchronous** (simple and fast).  
   - Bulk upload: **synchronous** within request (bounded by validation & limits).  
4) **Public vs Private URLs & Tokens:**  
   - **Public URLs**: accessible to anyone via short link.  
   - **Private URLs**: **require a user token** to resolve (per instructions).  
   - Web UI uses **session cookie + CSRF** for its own calls.  
5) **Documentation:** Swagger/OpenAPI (drf-spectacular) + Postman collection export.

---

## 1) Repository Layout (proposed)
```
repo-root/
├─ exercise1_python/
│  ├─ src/
│  │  ├─ main.py
│  │  └─ core.py
│  └─ tests/
│     └─ test_core.py
│
├─ exercise2_service/
│  ├─ backend/
│  │  ├─ project/
│  │  ├─ apps/
│  │  │  ├─ accounts/
│  │  │  └─ shortener/
│  │  ├─ requirements/
│  │  └─ docs/
│  │
│  ├─ frontend/
│  │  ├─ src/
│  │  │  ├─ pages/
│  │  │  ├─ components/
│  │  │  ├─ api/
│  │  │  └─ types/
│  │  └─ public/
│  │
│  └─ docker/
│     ├─ docker-compose.yml
│     ├─ backend.Dockerfile
│     └─ frontend.Dockerfile
│
└─ README.md
```

---

## 2) Exercise 1 — Python (small, standalone)
CLI-based validation exercise with pure functions and pytest tests.

---

## 3) Exercise 2 — URL Shortener Service (Django + DRF)
**Features:** Shorten, redirect, bulk shorten, list, edit, delete, track views.  
**Extras:** Private URLs require token; auth via DRF TokenAuth; session for web UI.

---

## 4) Security Design
- `.env` excluded from version control.  
- DRF TokenAuth for private URLs.  
- Session cookie + CSRF for web UI.  
- DRF throttles for rate limiting.  
- Upload validation (txt only, ≤5 MB).  
- Edit/delete only by owner.  
- CORS restricted to `localhost:5173`.

---

## 5) Data Model
**ShortURL:** id, short_code, target, is_private, owner, views, last_accessed_by, created_at, updated_at  
**UrlVisit:** shorturl, user, ip, ua, created_at

---

## 6) API Design
- Auth: register, login, logout, token, me  
- URLs: create, bulk, list (own + admin/all), patch, delete  
- Redirect: GET /{short_code} (token required for private)

---

## 7) Web UI (React + TS + MUI)
- Pages: Register, Login, Dashboard, Bulk Upload.  
- Features: shorten single URL, upload txt, copy tokened links, download results.

---

## 8) Docker & Runtime
- Compose: backend (Django) + db (Postgres).  
- Backend.Dockerfile: python:3.12-slim.  
- Database cache for throttling (no Redis).

---

## 9) Throttling
- anon: 20/min; user: 60/min; bulk/create: 10/min.  
- DRF database cache backend.

---

## 10) Testing
- Unit + API tests for validators, redirects, throttling, uploads.

---

## 11) Implementation Plan
1. Scaffold Django + DRF project.  
2. Configure PostgreSQL via Docker Compose.  
3. Build accounts + shortener apps.  
4. Implement CRUD, redirect, bulk upload.  
5. Integrate Swagger/Postman docs.  
6. Connect React frontend.  
7. Add Docker and README instructions.

---

## 12) Deliverables
- Public GitHub repo with backend, frontend, Docker, README, and docs.
