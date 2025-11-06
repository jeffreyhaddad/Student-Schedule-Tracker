# API Documentation

Complete reference for all Student Tracker API endpoints.

## Base URL

```
http://localhost:4000
```

## Authentication

All protected endpoints require a session ID in the `X-Session-Id` header:

```
X-Session-Id: 1737312345678_abc123def456
```

Obtain session ID via `/auth/login` or `/auth/register`. The session ID is returned in the response header and should be stored by the client.

## Response Format

All responses are JSON. Successful responses include data. Errors include message:

```json
{
  "id": 1,
  "title": "Example",
  "created_at": "2025-10-19T10:30:00Z"
}
```

Error responses:
```json
{
  "message": "Task not found"
}
```

Validation errors:
```json
{
  "errors": [
    {
      "msg": "Title must be a string",
      "param": "title"
    }
  ]
}
```

---

## 🔐 Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "email": "john@example.com"
}
```

**Response Headers:**
```
X-Session-Id: 1737312345678_abc123def456
```

**Validation Rules:**
- `first_name`: Required, string, 1-255 characters
- `last_name`: Required, string, 1-255 characters
- `username`: Required, unique, string, 1-100 characters
- `email`: Required, unique, valid email format
- `password`: Required, string (plaintext → hashed in DB)

**Error Responses:**
- `400 Bad Request`: Validation failed
- `409 Conflict`: Username or email already exists

---

### Login

Authenticate user and create session.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "email": "john@example.com"
}
```

**Response Headers:**
```
X-Session-Id: 1737312345678_abc123def456
```

**Error Responses:**
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Invalid credentials

---

### Get Profile

Get current authenticated user's profile.

**Endpoint:** `GET /auth/profile`

**Headers:**
```
X-Session-Id: <sessionId>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "created_at": "2025-10-19T10:00:00Z"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing session
- `404 Not Found`: User not found

---

## 📋 Task Endpoints

All task endpoints require authentication.

### List Tasks

Get all tasks for authenticated user.

**Endpoint:** `GET /tasks`

**Headers:**
```
X-Session-Id: <sessionId>
```

**Query Parameters:**
```
?sort=due_at    # Sort by: due_at, priority, status, created_at
?order=asc      # Order: asc, desc (default: asc)
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "student_id": 1,
    "title": "Complete project",
    "description": "Finish React component",
    "status": "pending",
    "priority": "high",
    "category": "Development",
    "due_at": "2025-10-25T23:59:59Z",
    "created_at": "2025-10-19T10:30:00Z",
    "updated_at": "2025-10-19T10:30:00Z"
  },
  {
    "id": 2,
    "student_id": 1,
    "title": "Review code",
    "description": "Check pull request",
    "status": "in-progress",
    "priority": "normal",
    "category": null,
    "due_at": "2025-10-22T17:00:00Z",
    "created_at": "2025-10-19T11:00:00Z",
    "updated_at": "2025-10-19T11:00:00Z"
  }
]
```

---

### Get Task

Get specific task by ID.

**Endpoint:** `GET /tasks/:id`

**Headers:**
```
X-Session-Id: <sessionId>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "student_id": 1,
  "title": "Complete project",
  "description": "Finish React component",
  "status": "pending",
  "priority": "high",
  "category": "Development",
  "due_at": "2025-10-25T23:59:59Z",
  "created_at": "2025-10-19T10:30:00Z",
  "updated_at": "2025-10-19T10:30:00Z"
}
```

**Error Responses:**
- `404 Not Found`: Task doesn't exist or doesn't belong to user

---

### Create Task

Create a new task.

**Endpoint:** `POST /tasks`

**Headers:**
```
X-Session-Id: <sessionId>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Complete project",
  "description": "Finish React component",
  "status": "pending",
  "priority": "high",
  "category": "Development",
  "due_at": "2025-10-25T23:59:59Z"
}
```

**Validation Rules:**
- `title`: Required, string, 1-225 characters
- `description`: Optional, string, max 1000 characters
- `status`: Required, one of: `pending`, `in-progress`, `completed`
- `priority`: Required, one of: `low`, `normal`, `high`
- `category`: Optional, string, max 100 characters
- `due_at`: Optional, ISO 8601 datetime

**Response:** `201 Created`
```json
{
  "id": 3,
  "student_id": 1,
  "title": "Complete project",
  "description": "Finish React component",
  "status": "pending",
  "priority": "high",
  "category": "Development",
  "due_at": "2025-10-25T23:59:59Z",
  "created_at": "2025-10-19T12:00:00Z",
  "updated_at": "2025-10-19T12:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed

---

### Update Task

Update existing task.

**Endpoint:** `PUT /tasks/:id`

**Headers:**
```
X-Session-Id: <sessionId>
Content-Type: application/json
```

**Request Body:** (same as create, any field optional)
```json
{
  "status": "in-progress",
  "priority": "normal"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "student_id": 1,
  "title": "Complete project",
  "description": "Finish React component",
  "status": "in-progress",
  "priority": "normal",
  "category": "Development",
  "due_at": "2025-10-25T23:59:59Z",
  "created_at": "2025-10-19T10:30:00Z",
  "updated_at": "2025-10-19T12:05:00Z"
}
```

**Error Responses:**
- `404 Not Found`: Task doesn't exist
- `400 Bad Request`: Validation failed

---

### Delete Task

Delete task by ID.

**Endpoint:** `DELETE /tasks/:id`

**Headers:**
```
X-Session-Id: <sessionId>
```

**Response:** `204 No Content`

**Error Responses:**
- `404 Not Found`: Task doesn't exist

---

### Search Tasks

Search tasks by title or description.

**Endpoint:** `GET /tasks/search?q=query`

**Headers:**
```
X-Session-Id: <sessionId>
```

**Query Parameters:**
- `q`: Search query (required)

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Complete project",
    "status": "pending",
    "priority": "high",
    ...
  }
]
```

---

## 📅 Schedule Entry Endpoints

All schedule endpoints require authentication.

### List Schedule Entries

Get all schedule entries for authenticated user.

**Endpoint:** `GET /schedule-entries`

**Headers:**
```
X-Session-Id: <sessionId>
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "student_id": 1,
    "weekday": 1,
    "start_time": "09:00:00",
    "end_time": "10:30:00",
    "subject": "Mathematics",
    "location": "Room 101",
    "notes": "Bring calculator",
    "is_active": true,
    "created_at": "2025-10-19T10:00:00Z",
    "updated_at": "2025-10-19T10:00:00Z"
  }
]
```

---

### Get Schedule Entry

Get specific schedule entry.

**Endpoint:** `GET /schedule-entries/:id`

**Headers:**
```
X-Session-Id: <sessionId>
```

**Response:** `200 OK` (same structure as above)

---

### Create Schedule Entry

Create new schedule entry.

**Endpoint:** `POST /schedule-entries`

**Headers:**
```
X-Session-Id: <sessionId>
Content-Type: application/json
```

**Request Body:**
```json
{
  "weekday": 1,
  "start_time": "09:00:00",
  "end_time": "10:30:00",
  "subject": "Mathematics",
  "location": "Room 101",
  "notes": "Bring calculator",
  "is_active": true
}
```

**Validation Rules:**
- `weekday`: Required, integer 0-6 (0=Sunday, 6=Saturday)
- `start_time`: Required, format HH:MM:SS
- `end_time`: Required, format HH:MM:SS, must be after start_time
- `subject`: Required, string, 1-255 characters
- `location`: Optional, string, max 255 characters
- `notes`: Optional, string
- `is_active`: Optional, boolean (default: true)

**Response:** `201 Created`
```json
{
  "id": 2,
  "student_id": 1,
  "weekday": 1,
  "start_time": "09:00:00",
  "end_time": "10:30:00",
  "subject": "Mathematics",
  "location": "Room 101",
  "notes": "Bring calculator",
  "is_active": true,
  "created_at": "2025-10-19T12:00:00Z",
  "updated_at": "2025-10-19T12:00:00Z"
}
```

---

### Update Schedule Entry

Update schedule entry.

**Endpoint:** `PUT /schedule-entries/:id`

**Headers:**
```
X-Session-Id: <sessionId>
Content-Type: application/json
```

**Request Body:** (any field optional)
```json
{
  "is_active": false,
  "notes": "Cancelled this week"
}
```

**Response:** `200 OK`

---

### Delete Schedule Entry

Delete schedule entry.

**Endpoint:** `DELETE /schedule-entries/:id`

**Headers:**
```
X-Session-Id: <sessionId>
```

**Response:** `204 No Content`

---

### Get by Weekday

Get schedule entries for specific weekday.

**Endpoint:** `GET /schedule-entries/weekday/:weekday`

**Headers:**
```
X-Session-Id: <sessionId>
```

**Path Parameters:**
- `weekday`: 0-6 (0=Sunday, 6=Saturday)

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "weekday": 1,
    "start_time": "09:00:00",
    "end_time": "10:30:00",
    "subject": "Mathematics",
    ...
  },
  {
    "id": 3,
    "weekday": 1,
    "start_time": "14:00:00",
    "end_time": "15:30:00",
    "subject": "Physics",
    ...
  }
]
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Successful delete |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Invalid/missing session |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate entry (email/username) |
| 500 | Internal Server Error - Server issue |

---

## Rate Limiting

Currently no rate limiting. Consider adding for production.

---

## Pagination

Not currently implemented. Consider adding for large datasets.

---

## Examples

### Complete Task Registration & Creation Flow

```bash
# 1. Register
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Smith",
    "username": "janesmith",
    "email": "jane@example.com",
    "password": "pass123"
  }'

# Save session ID from response header X-Session-Id, then use in next requests

SESSION_ID="1737312345678_abc123def456"

# 2. Create task
curl -X POST http://localhost:4000/tasks \
  -H "X-Session-Id: $SESSION_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Study for exam",
    "description": "Review chapters 1-5",
    "status": "in-progress",
    "priority": "high",
    "category": "Study",
    "due_at": "2025-10-25T23:59:59Z"
  }'

# 3. Get all tasks
curl -X GET "http://localhost:4000/tasks" \
  -H "X-Session-Id: $SESSION_ID"

# 4. Update task status
curl -X PUT http://localhost:4000/tasks/1 \
  -H "X-Session-Id: $SESSION_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

---

**For more information, see [README.md](./README.md) and [ARCHITECTURE.md](./ARCHITECTURE.md)**
