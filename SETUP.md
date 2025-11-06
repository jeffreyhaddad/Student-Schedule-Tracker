# Setup Guide

Step-by-step instructions to get Student Tracker running locally.

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Git

## Installation

### 1. Backend Setup

```bash
cd api
npm install
```

Copy environment template:
```bash
cp .env.example .env
```

Create PostgreSQL database:
```bash
createdb student_tracker
psql -U postgres -d student_tracker -f database/schema.sql
```

Start backend:
```bash
npm run dev
```

Server runs on `http://localhost:4000`

### 2. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

App runs on `http://localhost:5173`

## Configuration

### Backend .env

Required variables in `api/.env`:
```
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=student_tracker
DB_USER=student_tracker_user
DB_PASSWORD=your_password
CORS_ORIGIN=http://localhost:5173
```

### Frontend .env.local

Required variables in `frontend/.env.local`:
```
VITE_API_BASE_URL=http://localhost:4000
```

## Database

### Create Database

```bash
createdb student_tracker
psql -U postgres -d student_tracker -f api/database/schema.sql
```

### Reset Database

```bash
dropdb student_tracker
createdb student_tracker
psql -U postgres -d student_tracker -f api/database/schema.sql
```

### View Database

```bash
psql -U postgres -d student_tracker

# Inside psql:
\dt           # List tables
\d students   # Show table structure
SELECT * FROM students;  # Query data
\q            # Exit
```

## Development

### Run Backend

```bash
cd api
npm run dev
```

Hot reload enabled. Runs on port 4000.

### Run Frontend

```bash
cd frontend
npm run dev
```

Hot reload enabled. Runs on port 5173.

### Run Both

Terminal 1:
```bash
cd api && npm run dev
```

Terminal 2:
```bash
cd frontend && npm run dev
```

## Testing API

Use curl to test endpoints:

```bash
# Register
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "username": "john",
    "email": "john@test.com",
    "password": "pass123"
  }'

# Login (save session ID)
SESSION_ID=$(curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"pass123"}' \
  -D - | grep -i "x-session-id" | cut -d' ' -f2 | tr -d '\r')

# Get tasks
curl -X GET http://localhost:4000/tasks \
  -H "X-Session-Id: $SESSION_ID"

# Create task
curl -X POST http://localhost:4000/tasks \
  -H "X-Session-Id: $SESSION_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Study",
    "priority": "high",
    "status": "pending"
  }'
```

## Troubleshooting

### PostgreSQL Connection Error

Error: `could not connect to database server`

**Fix:**
```bash
# Check if PostgreSQL is running
brew services list  # macOS
psql -U postgres    # Try to connect
```

If not running:
```bash
brew services start postgresql  # macOS
```

### Port Already in Use

Error: `listen EADDRINUSE: address already in use :::4000`

**Fix:**
```bash
# Kill process on port 4000
lsof -i :4000
kill -9 <PID>

# Or change port in api/.env
PORT=4001
```

### Frontend Can't Reach API

Error in browser console: `Failed to fetch`

**Fix:**
- Check backend is running: `npm run dev` in api/
- Check URL: `VITE_API_BASE_URL=http://localhost:4000` in frontend/.env.local
- Clear browser cache

### Database Doesn't Exist

Error: `database "student_tracker" does not exist`

**Fix:**
```bash
createdb student_tracker
psql -U postgres -d student_tracker -f api/database/schema.sql
```

### Session Expired

Error: `Unauthorized: Invalid session`

**Fix:**
- Log out and log back in
- Sessions are stored in memory and expire when server restarts

### npm install Issues

Error: `npm ERR!`

**Fix:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Production Build

### Backend

No build needed. Run with:
```bash
cd api
NODE_ENV=production npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

Creates `dist/` folder for deployment.

## Git Workflow

Before pushing:

```bash
# Check status
git status

# Make sure no .env files are staged
git ls-files | grep ".env"  # Should be empty

# Stage and commit
git add .
git commit -m "Initial commit: Student Tracker"

# Push to GitHub
git push origin main
```

## More Info

- **API Documentation**: See [API.md](../API.md)
- **Project README**: See [README.md](../README.md)
