# Secure_To_Do_App

## Overview
This project is a secure **To-Do App** with a **Django backend** and **React TypeScript frontend**, using **PostgreSQL** as the database. It follows best security practices, including **JWT authentication**, **input validation**, and **Docker** containerization.

---

## Features
- User authentication with **JWT** (Login, Register, Refresh, Logout, Protected Routes)
- CRUD operations for managing tasks (coming soon)
- Secure API with Django REST Framework (DRF)
- React frontend with TypeScript and routing
- Loading states and error feedback in UI
- Database powered by PostgreSQL
- Containerized setup using **Docker & Docker Compose**

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

### 3️⃣ Start the Project with Docker
Run the following command to build and start all services:
```bash
docker-compose up --build
```
This will:
- Start **PostgreSQL** inside a Docker container
- Start **Django backend** (available at `http://localhost:8000`)
- Start **React frontend** (available at `http://localhost:5173`)

### 4️⃣ Run Migrations & Create Superuser
To apply migrations and create an admin user, run:
```bash
docker exec -it todo_django bash
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
  "username": "testuser",
  "password": "securepassword"
}
```
- Capture cookies from the response
- For future requests (e.g. `GET /auth/protected/`), set headers:
```
Cookie: access=<access_token>; refresh=<refresh_token>
```

✅ **Refresh token:**
```bash
POST http://localhost:8000/auth/token/refresh/
Content-Type: application/json

{
  "refresh": "<refresh_token>"
}
```

✅ **Logout and blacklist refresh token:**
```bash
POST http://localhost:8000/auth/logout/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "refresh": "<refresh_token>"
}
```

✅ **Access Protected Route:**
```bash
GET http://localhost:8000/auth/protected/
Authorization: Bearer <ACCESS_TOKEN>
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

## Useful Commands
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
- **Authentication & Session Management**: JWT access/refresh tokens with rotation and blacklisting
- **Access Control**: Protected routes in both frontend and backend
- **Cryptographic Storage**: Passwords hashed with PBKDF2 (Django default)
- **Injection Prevention**: Django ORM used to avoid raw SQL
- **Sensitive Data Exposure**: `.env` file for credentials, excluded via `.gitignore`
- **Security Misconfiguration**: Docker-based isolated environment
- **Component Security**: Dependencies managed via `pip` and `npm` with version control

🚀 Happy Coding!