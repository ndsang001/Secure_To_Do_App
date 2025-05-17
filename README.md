# Secure_To_Do_App

## Overview
This project is a secure **To-Do App** with a **Django backend** and **React TypeScript frontend**, using **SQLite** as the database. It follows OWASP security principles with **JWT authentication**, **rate limiting**, **CSRF protection**, **secure headers**, **input validation**, and **Docker** containerization.

---

## Features
* User authentication with JWT (Login, Register, Refresh, Logout)
* Secure cookie-based token storage (HttpOnly)
* Rate limiting and CSRF protection
* Full CRUD for task management (create, read, toggle, delete)
* Custom password validation with complexity enforcement
* Secure API using Django REST Framework (DRF)
* React frontend with TypeScript and routing
* Modern React 19 frontend with TypeScript, Zustand, and MUI
* State management using Zustand
* Global error handling and protected routes
* Loading states and error feedback in UI
* PostgreSQL database
* Docker-based containerization and environment isolation

---

## Prerequisites
Before setting up the project, ensure you have the following installed:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)
- Git

---

## Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/ndsang001/Secure_To_Do_App.git
cd Secure_To_Do_App
```

### 2️⃣ Create Environment Variables
In the **root folder**, create a `.env` file with the following:
```
POSTGRES_DB=todo_db
POSTGRES_USER=todo_user
POSTGRES_PASSWORD=securepassword
DATABASE_URL=postgres://todo_user:securepassword@db:5432/todo_db
SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=*
REACT_APP_BACKEND_URL=http://localhost:8000
```

If you're not using Docker, use this simpler .env instead in **backend** folder:
```
DJANGO_SECRET_KEY=your-very-secret-key
DATABASE_URL=postgres://todo_user:securepassword@db:5432/todo_db
DEBUG=True
```

### 3️⃣ Start the Project with Docker
Run the following command to build and start all services:
```bash
docker-compose up --build
```
This will:
- Start **PostgreSQL** inside a Docker container (The current implementation does not use PostgreSQL, but it would be kept for future developement)
- Start **Django backend** (available at `http://localhost:8000`)
- Start **React frontend** (available at `http://localhost:5173`)

### 4️⃣ Run Migrations & Create Superuser
To apply migrations and create an admin user, run:
```bash
docker exec -it todo_django bash
python manage.py makemigrations auth_app
python manage.py migrate
python manage.py createsuperuser
exit
```

### 5️⃣ Test the API
✅ **Register a new user:**
```bash
POST http://localhost:8000/auth/register/
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "securepassword"
}
```

✅ **Login to get JWT token:**
```bash
POST http://localhost:8000/auth/login/
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "securepassword"
}
```
- Cookies (access, refresh) will be set in the browser if you use withCredentials: true in frontend requests.

✅ **Refresh token: (if needed)**
```bash
POST http://localhost:8000/auth/refresh/
Content-Type: application/json

{
  "refresh": "<refresh_token>"
}
```

✅ **Logout**
```bash
POST http://localhost:8000/auth/logout/
```

✅ **Access Protected Route:**
```bash
GET http://localhost:8000/auth/protected/
```

---

## Task API Endpoints

All endpoints below require login (auth via cookies):

### ➕ Create a Task
```http
POST http://localhost:8000/auth/todos/
Content-Type: application/json

{
  "text": "Buy groceries"
}
```

### 📋 Get All Tasks
```http
GET http://localhost:8000/auth/todos/
```

### 🔄 Toggle Task Completion
```http
PATCH http://localhost:8000/auth/todos/<todo_id>/toggle/
```

### ❌ Clear Completed Tasks
```http
DELETE http://localhost:8000/auth/todos/clear_completed/
```

---

## Running Without Docker (Optional)
If you prefer to run the project **without Docker**, follow these steps:

### 🔹 Backend (Django)
```bash
cd backend
python -m venv venv  # Create a virtual environment
source venv/bin/activate  # Activate (use venv\Scripts\activate on Windows)
pip install -r requirements.txt  # Install dependencies
python manage.py runserver
```

### 🔹 Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
Access React at **http://localhost:5173**.

---

## Useful Docker Commands
✅ **Stop all containers:**
```bash
docker-compose down
```
✅ **Rebuild without cache:**
```bash
docker-compose up --build --force-recreate
```
✅ **Check logs:**
```bash
docker logs todo_django
```

---

## Security Aspects Covered (OWASP-Based)
- **Authentication & Session Management**: JWT access/refresh cookies, HTTP-only, secure
- **Access Control**: Protected routes in both frontend and backend. Todos filtered by authenticated user
- **Cryptographic Storage**: Passwords hashed with PBKDF2 (Django default)
- **Injection Prevention**: Django ORM used to avoid raw SQL
- **Sensitive Data Exposure**: `.env` file for credentials, excluded via `.gitignore`
- **Security Misconfiguration**: Docker-based isolated environment
- **Component Security**: Dependencies managed via `pip` and `npm` with version control
* **CSRF Protection**: Enabled via Django + Axios configuration
* **Rate Limiting**: Login/registration endpoints protected
* **Input Validation**: Frontend validation using Yup + backend validation via serializers
* **Password Storage**: PBKDF2 (Django default)
* **Secure Headers**: Custom middleware adds strict security headers
* **CORS Control**: Only frontend origin is allowed
* **Error Handling**: Global error boundaries and user feedback via snackbar

---

## License

This project is for educational purposes and demonstration of secure full-stack app development.

---

## Status

Project is stable and in active development. Contributions are welcome!

🚀 Happy Coding!