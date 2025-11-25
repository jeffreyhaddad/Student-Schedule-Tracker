# Student Tracker API

A robust NestJS backend API for managing student tasks and schedules. Provides RESTful endpoints with JWT authentication, comprehensive validation, and Swagger documentation.

## Overview

This is the backend service for the Student Tracker application, built with NestJS and TypeORM. It handles authentication, user management, task operations, and schedule management with a PostgreSQL database.

## Technology Stack

- **Framework**: NestJS 11.0.1
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM 0.3.27
- **Authentication**: JWT + Passport
- **Validation**: Class Validator + Class Transformer
- **Documentation**: Swagger/OpenAPI
- **Password Hashing**: bcrypt/bcryptjs
- **API Documentation**: Swagger Module

## Prerequisites

- Node.js 16+ 
- npm 8+
- PostgreSQL 12+

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

```bash
bash setup-db.sh
```

This script will:
- Create the `student_tracker` database
- Load the schema from `database/schema.sql`
- Insert sample test data

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_postgres_password
DATABASE_NAME=student_tracker

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Debug Mode
```bash
npm run start:debug
```

### Production Mode
```bash
npm run start:prod
```

The server will start on `http://localhost:3000` by default.

## API Documentation

Once the server is running, access the interactive Swagger documentation at:

```
http://localhost:3000/docs
```

The documentation includes all available endpoints, request/response schemas, and allows testing endpoints directly from the browser.

## Available Scripts

```bash
# Development
npm run start        # Start the application
npm run start:dev    # Start with watch mode
npm run start:debug  # Start in debug mode
npm run start:prod   # Start production build

# Build
npm run build        # Compile TypeScript to JavaScript

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:cov     # Run tests with coverage report
npm run test:debug   # Debug tests
npm run test:e2e     # Run end-to-end tests
```

## Project Structure

```
src/
├── auth/                        # Authentication module
│   ├── auth.controller.ts       # Auth endpoints
│   ├── auth.service.ts          # Auth business logic
│   ├── auth.module.ts           # Auth module definition
│   └── dto/
│       └── login.dto.ts         # Login request schema
│
├── student/                     # Student management
│   ├── student.controller.ts    # Student endpoints
│   ├── student.service.ts       # Student business logic
│   ├── student.module.ts        # Student module
│   └── dto/
│       ├── create-student.dto.ts
│       └── update-student.dto.ts
│
├── task/                        # Task management
│   ├── task.controller.ts       # Task endpoints
│   ├── task.service.ts          # Task business logic
│   ├── task.module.ts           # Task module
│   └── dto/
│       ├── create-task.dto.ts
│       └── update-task.dto.ts
│
├── schedule/                    # Schedule management
│   ├── schedule.controller.ts   # Schedule endpoints
│   ├── schedule.service.ts      # Schedule business logic
│   ├── schedule.module.ts       # Schedule module
│   └── dto/
│       ├── create-schedule.dto.ts
│       └── update-schedule.dto.ts
│
├── entities/                    # Database entities
│   ├── student.entity.ts        # Student entity
│   ├── task.entity.ts           # Task entity
│   └── schedule-entry.entity.ts # Schedule entry entity
│
├── config/                      # Configuration
│   └── database.config.ts       # TypeORM database config
│
├── app.module.ts                # Root application module
└── main.ts                      # Application entry point

database/
└── schema.sql                   # PostgreSQL schema and migrations
```

## API Endpoints

### Authentication

#### Register New User
```http
POST /auth/register
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

### Students

#### Get Student Profile
```http
GET /student
Authorization: Bearer {access_token}
```

#### Update Student Profile
```http
PUT /student
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Smith"
}
```

### Tasks

#### Get All Tasks
```http
GET /task
Authorization: Bearer {access_token}
```

#### Create Task
```http
POST /task
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Complete Assignment",
  "description": "Finish math homework",
  "due_at": "2025-12-31T23:59:59Z",
  "priority": "high",
  "category": "homework",
  "status": "pending"
}
```

#### Get Task by ID
```http
GET /task/:id
Authorization: Bearer {access_token}
```

#### Update Task
```http
PUT /task/:id
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "status": "in-progress",
  "priority": "normal"
}
```

#### Delete Task
```http
DELETE /task/:id
Authorization: Bearer {access_token}
```

### Schedules

#### Get All Schedules
```http
GET /schedule
Authorization: Bearer {access_token}
```

#### Create Schedule Entry
```http
POST /schedule
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Class",
  "start_time": "2025-12-20T10:00:00Z",
  "end_time": "2025-12-20T11:00:00Z",
  "description": "Math Class"
}
```

#### Update Schedule Entry
```http
PUT /schedule/:id
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Updated Class"
}
```

#### Delete Schedule Entry
```http
DELETE /schedule/:id
Authorization: Bearer {access_token}
```

## Database Schema

### Students Table
```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'normal',
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Schedule Entries Table
```sql
CREATE TABLE schedule_entries (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Backend returns an `access_token`
3. Include token in the `Authorization` header: `Bearer {token}`
4. Token is validated for protected routes

All endpoints except `/auth/register` and `/auth/login` require authentication.

## Validation

The API implements comprehensive validation using `class-validator`:

- Email format validation
- Password strength requirements
- Required field validation
- Type checking
- Custom validators

Invalid requests return a `400 Bad Request` with detailed error messages.

## Error Handling

Standard HTTP error codes are used:

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input or validation error
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Sample Test Credentials

After running `setup-db.sh`, you can use these credentials to test:

```
Username: johndoe
Email: johndoe@email.com
Password: (Check the hashed password in the database or register a new account)
```

## CORS Configuration

The API has CORS enabled for all origins (`*`). In production, restrict this to specific domains by modifying the CORS configuration in `src/main.ts`.

## Development Tips

### Creating a New Module

```bash
nest g module features/new-feature
nest g controller features/new-feature
nest g service features/new-feature
```

### TypeORM Migrations

To create a new migration:
```bash
npm run typeorm migration:create src/migrations/MigrationName
```

### Debugging

Use VS Code debugger with the debug launch configuration or run:
```bash
npm run start:debug
```

## Production Deployment

### Build for Production
```bash
npm run build
```

### Run in Production
```bash
NODE_ENV=production npm run start:prod
```

### Environment Considerations
- Use strong JWT secret
- Enable HTTPS
- Restrict CORS origins
- Use environment-specific database URLs
- Enable database backups
- Monitor error logs
- Set up monitoring and alerting

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check `DATABASE_HOST`, `DATABASE_USER`, `DATABASE_PASSWORD` in `.env`
- Verify database exists

### JWT Errors
- Ensure `JWT_SECRET` is set in `.env`
- Check token hasn't expired
- Verify token format in Authorization header

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## Testing

Run the test suite:

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e
```

## Contributing

1. Follow NestJS best practices
2. Write tests for new features
3. Use TypeScript for type safety
4. Format code with `npm run format`
5. Run linting: `npm run lint`

## License

UNLICENSED

## Support

For issues or questions about the frontend, see the `../frontend/README.md`

---

**Built with NestJS | Powered by TypeORM | Secured with JWT** 🚀
