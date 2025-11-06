# Student Tracker 📚

A full-stack application for managing student tasks and schedules. Register, create tasks with priorities, and organize your weekly schedule.

**Authentication:** Session-based (bcrypt password hashing, no JWT)

## Features

- **User Authentication**: Session-based login with secure bcrypt password hashing
- **Task Management**: Create, edit, delete tasks with priorities and due dates
- **Schedule Management**: Organize weekly schedule with class times
- **Dashboard**: Quick overview of your schedule and tasks
- **Search & Filter**: Find tasks and filter schedule by day
- **Data Isolation**: Each student's data is completely isolated

## Tech Stack

**Backend**: Node.js, Express, PostgreSQL, bcrypt, sessions  
**Frontend**: React, React Router, Vite

## Quick Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL (running)

### Backend

```bash
cd api
npm install
cp .env.example .env

# Create database
createdb student_tracker

# Import schema
psql -U postgres -d student_tracker -f database/schema.sql

# Start server (port 4000)
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local

# Start dev server (port 5173)
npm run dev
```

Register a new account and you're ready to go!

## API Endpoints

See **[API.md](./API.md)** for full documentation.

Quick reference:
- `POST /auth/register` - Register (returns session)
- `POST /auth/login` - Login (returns session)
- `POST /auth/logout` - Logout (clears session)
- `GET /auth/profile` - Get current user (protected)
- `GET /tasks` - Get tasks (protected)
- `POST /tasks` - Create task (protected)
- `PUT /tasks/:id` - Update task (protected)
- `DELETE /tasks/:id` - Delete task (protected)
- `GET /schedule-entries` - Get schedule (protected)
- `POST /schedule-entries` - Create entry (protected)

## Database Setup

```bash
# Create database
createdb student_tracker

# Import schema
psql -U postgres -d student_tracker -f api/database/schema.sql

# To reset (delete all data)
dropdb student_tracker
createdb student_tracker
psql -U postgres -d student_tracker -f api/database/schema.sql
```

## Environment Variables

**Backend (.env)**
```
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=student_tracker
DB_USER=student_tracker_user
DB_PASSWORD=your_password
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env.local)**
```
VITE_API_BASE_URL=http://localhost:4000
```

See `.env.example` files in each directory for templates.

## Troubleshooting

**Can't connect to database?**
- Make sure PostgreSQL is running
- Check `.env` credentials
- Verify database exists: `psql -U postgres -l | grep student_tracker`

**Frontend can't reach API?**
- Check backend is running on port 4000
- Check `VITE_API_BASE_URL=http://localhost:4000` in `.env.local`
- Clear browser cache

**Port already in use?**
- Change port in `.env` or kill process: `lsof -i :4000 | kill -9 <PID>`

## Project Structure

```
api/
├── src/
│   ├── controllers/    # HTTP handlers
│   ├── services/       # Business logic
│   ├── domain/
│   │   ├── entities/   # Models
│   │   ├── repositories/  # Data layer
│   │   └── dto/        # Data objects
│   ├── routes/         # API endpoints
│   └── validators/     # Input validation
├── database/schema.sql
└── package.json

frontend/
├── src/
│   ├── pages/          # Page components
│   ├── components/     # Reusable components
│   ├── hooks/          # Custom React hooks
│   └── services/       # API calls
└── package.json
```

## Development

```bash
# Run backend
cd api
npm run dev

# Run frontend
cd frontend
npm run dev

# Build for production
cd frontend
npm run build
```

## License

Educational project.

## Questions?

See [SETUP.md](./SETUP.md) for detailed setup, [API.md](./API.md) for API details, or [DOCS.md](./DOCS.md) for documentation structure.

### More Documentation

- **Setup Guide**: [SETUP.md](./SETUP.md)
- **API Reference**: [API.md](./API.md)
- **Backend Architecture**: [api/README.md](./api/README.md)
- **Frontend Architecture**: [frontend/README.md](./frontend/README.md)
- **Component Docs**: [frontend/COMPONENTS.md](./frontend/COMPONENTS.md)
- **Documentation Guide**: [DOCS.md](./DOCS.md)
