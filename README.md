# Student Tracker

A comprehensive full-stack application for managing student tasks and schedules. Track assignments, manage due dates, and organize your academic workload with ease.

## Project Overview

Student Tracker is a modern web application built with a React frontend and NestJS backend that enables students to:
- Create and manage their accounts
- Organize tasks with priorities and categories
- Set and track schedules
- View dashboard analytics
- Authenticate securely with JWT tokens

## Tech Stack

### Backend
- **Framework**: NestJS 11.0
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT + Passport
- **API Documentation**: Swagger/OpenAPI
- **Runtime**: Node.js

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS + Bootstrap 5
- **Routing**: React Router DOM
- **HTTP Client**: Fetch API

## Project Structure

```
student_tracker_final/
├── api/                          # NestJS backend
│   ├── src/
│   │   ├── auth/                # Authentication module
│   │   ├── student/             # Student management
│   │   ├── task/                # Task management
│   │   ├── schedule/            # Schedule management
│   │   ├── entities/            # Database entities
│   │   ├── config/              # Configuration files
│   │   └── main.ts              # Application entry point
│   ├── database/
│   │   └── schema.sql           # Database schema
│   ├── setup-db.sh              # Database setup script
│   └── package.json
│
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API services
│   │   ├── App.tsx              # Root component
│   │   └── main.tsx             # Entry point
│   ├── vite.config.ts           # Vite configuration
│   └── package.json
│
└── README.md                     # This file
```

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL 12+

### Setup Instructions

1. **Clone the repository and install dependencies:**

```bash
# Install API dependencies
cd api
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

2. **Set up the database:**

```bash
cd api
bash setup-db.sh
```

3. **Configure environment variables:**

Create a `.env` file in the `api/` directory:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=student_tracker
JWT_SECRET=your_secret_key
PORT=3000
```

4. **Start the backend:**

```bash
cd api
npm run start:dev
```

The API will be available at `http://localhost:3000`

5. **Start the frontend (in a new terminal):**

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Documentation

Once the backend is running, visit `http://localhost:3000/docs` to explore the API using Swagger UI.

### Main API Endpoints

- **Authentication**
  - `POST /auth/login` - Login with credentials
  - `POST /auth/register` - Create a new account

- **Students**
  - `GET /student` - Get student profile
  - `PUT /student` - Update student profile

- **Tasks**
  - `GET /task` - List all tasks
  - `POST /task` - Create a new task
  - `GET /task/:id` - Get task details
  - `PUT /task/:id` - Update a task
  - `DELETE /task/:id` - Delete a task

- **Schedules**
  - `GET /schedule` - List all schedule entries
  - `POST /schedule` - Create a new schedule entry
  - `PUT /schedule/:id` - Update a schedule entry
  - `DELETE /schedule/:id` - Delete a schedule entry

## Features

### User Authentication
- Secure user registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and endpoints

### Task Management
- **Create, read, update, and delete tasks** with full CRUD operations
- **Inline editing**: Click directly on task title or description to edit
- **Status management**: Click status badge to cycle through pending → in-progress → completed
- **Priority management**: Click priority badge to cycle through low → normal → high
- **Set task priorities** (low, normal, high)
- **Assign due dates** with validation
- **Add descriptions and categories**
- **Track task status** (pending, in-progress, completed)
- Real-time error handling with inline error display

### Schedule Management
- **Create and manage schedule entries** with location and notes
- **Inline editing**: Click on subject, location, or notes to edit
- **Inline time editing**: Click start/end times to modify with HH:MM format
- **Quick class duplication**: Click duplicate button to open day selector, instantly copy to any day
- **Time conflict prevention**: Backend validation prevents overlapping schedules
- **Organize time slots** with visual day-based layout
- **Track scheduled activities** throughout your week

### Dashboard
- **Statistics overview**: Display counts of pending, in-progress, and completed tasks
- **Quick search**: Search and filter tasks by title and category
- **View summary** of upcoming tasks and schedules
- **Quick access** to active tasks and this week's classes
- **User profile management** with logout functionality

### Modern User Experience
- **Responsive design**: Works seamlessly on desktop, tablet, and mobile
- **Gradient design**: Modern gradient backgrounds with smooth animations
- **Interactive elements**: Hover effects and smooth transitions (0.3s ease)
- **Inline error display**: Validation errors shown in red alert boxes instead of popups
- **Fast operations**: No page reloads required for edits, status changes, or duplications

## Development

### API Development

```bash
cd api

# Run in development mode with hot reload
npm run start:dev

# Run linting and formatting
npm run lint
npm run format

# Run tests
npm run test
npm run test:watch

# Build for production
npm run build
npm run start:prod
```

The API provides:
- RESTful endpoints with complete CRUD operations
- JWT authentication with protected routes
- Comprehensive validation with detailed error messages
- Time conflict detection for schedules
- Swagger documentation at `http://localhost:3000/docs`

### Frontend Development

```bash
cd frontend

# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

The frontend features:
- React 19 with TypeScript for type safety
- Vite for fast hot module replacement during development
- Inline editing system with click-to-edit paradigm
- Interactive badge system for quick status/priority changes
- Modal popup for complex operations (day selection)
- Bootstrap 5 with custom gradient styling

## Database Schema

The application uses three main entities:

- **Students**: User accounts with authentication
- **Tasks**: Academic tasks with status, priority, and due dates
- **ScheduleEntries**: Time-based scheduling information

See `api/database/schema.sql` for the complete database schema.

## Environment Variables

### Backend (.env)
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=student_tracker
JWT_SECRET=your_jwt_secret_key
PORT=3000
NODE_ENV=development
```

## Testing

### Run API Tests
```bash
cd api
npm run test        # Run unit tests
npm run test:cov    # Run with coverage
npm run test:e2e    # Run e2e tests
```

## Deployment

### API Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Run: `npm run start:prod`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist/` folder to your hosting service

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

UNLICENSED

## Support

For issues, questions, or suggestions, please refer to the individual README files in the `api/` and `frontend/` directories.

---

**Happy studying! Track your progress and stay organized with Student Tracker! 📚**
