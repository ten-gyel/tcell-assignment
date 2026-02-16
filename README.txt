Task Management Project - Implementation Overview
=================================================

1) How this project was built
-----------------------------
This project was implemented as a full-stack web application using a clean backend/frontend split.

- Backend was developed with FastAPI and SQLAlchemy for REST API endpoints, data modeling,
  authentication, role-based authorization, and audit logging.
- Frontend was built with Next.js (App Router), TypeScript, and Tailwind CSS to provide
  an authenticated dashboard experience and role-aware navigation.
- JWT-based authentication was implemented and consumed from the frontend via Axios.
- SQLite was used as the database for straightforward local setup and portability.
- Docker support was added with dedicated backend/frontend Dockerfiles and a docker-compose setup.


2) Project structure
--------------------
Repository root
- app/                        -> FastAPI backend
- frontend/                   -> Next.js frontend
- requirements.txt            -> Python dependencies
- docker-compose.yml          -> Multi-service local container setup
- Dockerfile.backend          -> Backend container image
- Dockerfile.frontend         -> Frontend container image
- app.db                      -> SQLite database file

Backend structure (app/)
- main.py                     -> FastAPI app bootstrap, CORS, router registration
- core/
  - config.py                 -> App settings defaults (JWT config, DB URL)
  - security.py               -> Password hashing, JWT creation/validation, role dependency checks
- db/
  - session.py                -> SQLAlchemy engine/session/base setup
- models/
  - user.py                   -> User table model
  - task.py                   -> Task table model
  - audit_log.py              -> Audit log table model
- schemas/
  - user.py                   -> User/token request-response schemas
  - task.py                   -> Task request-response schemas + status enum
  - audit_log.py              -> Audit response schema
- api/
  - auth.py                   -> Register/login routes
  - users.py                  -> Current user, user listing, role change routes
  - tasks.py                  -> Task CRUD routes + audit logging hooks
  - audit.py                  -> Audit retrieval route with role filtering
- services/
  - user_service.py           -> User create/auth/update role logic
  - task_service.py           -> Task business logic + role/status restrictions
  - audit_service.py          -> Audit log write logic

Frontend structure (frontend/app/)
- layout.tsx                  -> Global app wrapper + AuthProvider
- page.tsx                    -> Root redirect to /dashboard
- login/page.tsx              -> Login form and token acquisition
- dashboard/page.tsx          -> User summary and role-based guidance
- tasks/page.tsx              -> Task listing/create/edit/delete + status updates
- users/page.tsx              -> Admin-only user and role management
- audit/page.tsx              -> Audit log table view
- context/AuthContext.tsx     -> Auth state, token persistence, user bootstrap
- lib/axios.ts                -> API client + Authorization header injection
- components/
  - ProtectedRoute.tsx        -> Route-level auth/role guard
  - Layout.tsx                -> Shared page shell + sidebar/header
  - Sidebar.tsx               -> Role-aware navigation + logout
  - TaskTable.tsx             -> Task table and actions
  - TaskFormModal.tsx         -> Create/edit task modal form
  - UserTable.tsx             -> User list and role selector
  - AuditLogTable.tsx         -> Audit log table
  - Toast.tsx                 -> Reusable success/error toast


3) Features implemented
-----------------------
A. Authentication
- User registration endpoint
- Login endpoint using OAuth2 password form flow
- JWT access token generation
- Password hashing with bcrypt (Passlib)
- Frontend token persistence in localStorage
- Automatic Authorization: Bearer header injection via Axios interceptor

B. Role-based access control (RBAC)
Roles used:
- Admin
- Manager
- Member
- Viewer

Access behavior:
- Admin: full user role management, task management, full audit access
- Manager: task management and scoped audit access
- Member: limited task updates and own audit access
- Viewer: read-only tasks, no task updates, no audit page access

C. Task management
- List tasks (scope depends on role)
- Create task (Admin/Manager)
- Edit task (role and rule constrained)
- Delete task (Admin/Manager)
- Status values: Todo, Doing, Done
- Member-specific status transition rules:
  - Todo -> Doing
  - Doing -> Done
  - no arbitrary transitions

D. Audit logging
- CREATE/UPDATE/DELETE actions on tasks are logged
- Log captures user_id, entity, entity_id, old_data/new_data, timestamp
- Audit retrieval policy:
  - Admin sees all logs
  - Manager/Member sees own logs
  - Viewer is denied

E. Frontend pages and UX
- Login page
- Dashboard page with quick role reminders
- Tasks page with create/edit modal and toast notifications
- Users page (Admin-only)
- Audit page (Admin/Manager/Member)
- Sidebar dynamically renders links based on role


4) Database design
------------------
Database: SQLite (app.db)
ORM: SQLAlchemy

Tables:
- users
  - id (PK)
  - email (unique)
  - hashed_password
  - role
  - created_at

- tasks
  - id (PK)
  - title
  - description
  - status
  - assignee_id (FK -> users.id, nullable)
  - created_by (FK -> users.id)
  - created_at

- audit_logs
  - id (PK)
  - user_id (FK -> users.id)
  - action
  - entity
  - entity_id
  - old_data (JSON, nullable)
  - new_data (JSON, nullable)
  - timestamp

The backend creates tables on startup with SQLAlchemy metadata.


5) Backend routes overview
--------------------------
Auth
- POST /api/auth/register      -> Create user
- POST /api/auth/login         -> Returns access token

Users
- GET  /api/users/me           -> Current authenticated user
- GET  /api/users              -> List users (Admin/Manager)
- PUT  /api/users/{id}/role    -> Change role (Admin)

Tasks
- GET    /api/tasks            -> List tasks (role-scoped)
- POST   /api/tasks            -> Create task (Admin/Manager)
- PUT    /api/tasks/{task_id}  -> Update task (role/rule-scoped)
- DELETE /api/tasks/{task_id}  -> Delete task (Admin/Manager)

Audit
- GET /api/audit               -> Role-scoped audit retrieval

System
- GET /                        -> Health check


6) Tools, libraries, and frameworks used
----------------------------------------
Backend
- Python
- FastAPI
- Uvicorn
- SQLAlchemy
- python-jose (JWT)
- passlib[bcrypt]
- Pydantic

Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios

DevOps / Packaging
- Docker
- Docker Compose


7) Notes for evaluation
-----------------------
- The project demonstrates full-stack delivery with authentication, RBAC, CRUD workflows,
  and auditability.
- RBAC is enforced in backend API dependencies/logic and reflected in frontend routing/navigation.
- The architecture separates concerns across models, schemas, services, and API routes,
  making the codebase understandable and maintainable.
- The Docker setup allows reviewers to run the complete stack quickly.
