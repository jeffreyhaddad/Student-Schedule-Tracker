# Student Tracker - Backend API

Node.js + Express backend with PostgreSQL database.

## 🏗️ Architecture

Clean architecture pattern with layered separation:

```
src/
├── controllers/       # HTTP request handlers
│   ├── AuthController.js
│   ├── TaskController.js
│   ├── StudentController.js
│   └── ScheduleEntryController.js
├── services/          # Business logic layer
│   ├── TaskService.js
│   ├── StudentService.js
│   └── ScheduleEntryService.js
├── domain/
│   ├── entities/      # Domain models
│   │   ├── Task.js
│   │   ├── Student.js
│   │   └── ScheduleEntry.js
│   ├── repositories/  # Data access layer
│   │   ├── TaskRepository.js
│   │   ├── StudentRepository.js
│   │   └── ScheduleEntryRepository.js
│   └── dto/           # Data Transfer Objects
│       ├── TaskDTO.js
│       ├── StudentDTO.js
│       └── ScheduleEntryDTO.js
├── routes/            # API route definitions
│   ├── authRoutes.js
│   ├── taskRoutes.js
│   ├── studentRoutes.js
│   └── scheduleEntryRoutes.js
├── middlewares/       # Express middlewares
│   ├── authMiddleware.js
│   └── errorHandler.js
├── validators/        # Input validation (express-validator)
│   ├── authValidators.js
│   ├── taskValidators.js
│   ├── studentValidators.js
│   └── scheduleEntryValidators.js
├── config/
│   └── db.js          # PostgreSQL connection
├── utils/
│   └── helpers.js     # Utility functions
├── app.js             # Express app setup
└── server.js          # Server entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 12+ running

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
```

### Database Setup

```bash
# Create database
createdb student_tracker

# Run schema
psql -U postgres -d student_tracker -f database/schema.sql
```

### Run Development Server

```bash
npm run dev
```

Server runs on `http://localhost:4000`

## 🔧 Configuration

Edit `.env` file:

```bash
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=student_tracker
DB_USER=student_tracker_user
DB_PASSWORD=your_password
CORS_ORIGIN=http://localhost:5173
```

## 🔐 Authentication

- **Session-based authentication** using in-memory storage
- Passwords hashed with **bcrypt**
- Session ID passed via `X-Session-Id` header
- Sessions stored in Map (lost on server restart)

### Session Flow

1. User registers/logs in → Session created
2. Session ID returned in `X-Session-Id` response header
3. Client stores session ID
4. Client sends session ID in `X-Session-Id` request header
5. Middleware validates session and attaches user to `req.user`

## 📋 Available Scripts

```bash
npm run dev      # Start with nodemon (auto-restart)
npm start        # Start production server
npm test         # Run tests (not yet implemented)
```

## 🗄️ Database Schema

### Students Table
```sql
id, first_name, last_name, username, email, password_hash, created_at
```

### Tasks Table
```sql
id, student_id, title, description, status, priority, category, due_at, created_at, updated_at
```

### Schedule Entries Table
```sql
id, student_id, weekday, start_time, end_time, subject, location, notes, is_active, created_at, updated_at
```

## 🛠️ Development Patterns

### Request Flow

```
Request → Route → Validator → Controller → Service → Repository → Database
                      ↓           ↓          ↓          ↓
                   Error ← DTO ← Entity ← SQL Result
```

### Example: Create Task

1. **Route** (`taskRoutes.js`): `POST /tasks` → validator → controller
2. **Validator** (`taskValidators.js`): Validate input (title, priority, etc.)
3. **Controller** (`TaskController.js`): Extract data, call service
4. **Service** (`TaskService.js`): Business logic, call repository
5. **Repository** (`TaskRepository.js`): SQL query, return entity
6. **Entity** (`Task.js`): Map database row to object
7. **DTO** (`TaskDTO.js`): Format response for client
8. **Controller**: Return JSON response

## 📚 API Documentation

See **[../API.md](../API.md)** for complete API reference.

Quick reference:
- `POST /auth/register` - Create account
- `POST /auth/login` - Authenticate
- `POST /auth/logout` - End session
- `GET /auth/profile` - Get current user
- `GET /tasks` - List tasks
- `POST /tasks` - Create task
- `GET /schedule-entries` - List schedule

## 🧪 Testing

```bash
# Manual testing with curl
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "pass123"
  }'
```

## 📦 Dependencies

- **express** (5.1.0) - Web framework
- **pg** (8.16.3) - PostgreSQL client
- **bcrypt** (6.0.0) - Password hashing
- **express-validator** (7.0.1) - Input validation
- **cors** (2.8.5) - CORS middleware
- **dotenv** (17.2.2) - Environment variables

## 🐛 Troubleshooting

### Database Connection Failed

```bash
# Check PostgreSQL is running
psql -U postgres

# Check .env credentials match PostgreSQL user
# Verify database exists
psql -U postgres -l | grep student_tracker
```

### Port Already in Use

```bash
# Find process on port 4000
lsof -i :4000

# Kill it
kill -9 <PID>
```

## 📖 More Info

- **Main README**: [../README.md](../README.md)
- **Setup Guide**: [../SETUP.md](../SETUP.md)
- **API Reference**: [../API.md](../API.md)
