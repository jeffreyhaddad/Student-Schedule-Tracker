# Student Tracker API - Detailed Endpoint Reference

Complete documentation of all API endpoints with request/response examples, error codes, and implementation notes.

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Endpoints Reference](#endpoints-reference)
5. [Request/Response Examples](#requestresponse-examples)
6. [Status Codes](#status-codes)
7. [Rate Limiting](#rate-limiting)
8. [Best Practices](#best-practices)

## Overview

**Base URL**: `http://localhost:3000`

**API Version**: 1.0

**Authentication**: JWT Bearer Token

**Content-Type**: `application/json`

**Default Port**: 3000

All requests (except login/register) require an `Authorization` header with a valid JWT token.

## Authentication

### Token Format

```
Authorization: Bearer {access_token}
```

### Token Lifespan

- Tokens expire after 24 hours
- Refresh tokens not implemented in current version
- User must re-login after expiration

### Token Storage (Frontend)

Tokens are stored in browser `localStorage`:

```javascript
localStorage.setItem('token', access_token);
localStorage.setItem('user', JSON.stringify(user));
```

---

## Error Handling

### Error Response Format

All errors return JSON with consistent structure:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Error type"
}
```

### Common Error Messages

| Status | Message | Cause |
|--------|---------|-------|
| 400 | Validation failed | Invalid input data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 500 | Internal server error | Server-side error |

### Validation Error Response

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "BadRequestException",
  "details": [
    {
      "field": "email",
      "message": "email must be valid"
    }
  ]
}
```

---

## Endpoints Reference

### Authentication Endpoints

#### `POST /auth/register`

Create a new user account.

**Authentication**: Not required

**Request Body**:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Request Validation**:
- `first_name`: string, required, max 255 chars
- `last_name`: string, required, max 255 chars
- `username`: string, required, unique, max 100 chars, alphanumeric
- `email`: string, required, unique, valid email format
- `password`: string, required, min 8 chars

**Success Response (201)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

**Error Responses**:
- `400`: Validation failed (invalid email, weak password, etc.)
- `409`: Email or username already exists

**Example cURL**:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

---

#### `POST /auth/login`

Authenticate and receive JWT token.

**Authentication**: Not required

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Request Validation**:
- `email`: string, required, valid email format
- `password`: string, required

**Success Response (200)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

**Error Responses**:
- `400`: Missing email or password
- `401`: Invalid credentials

**Example cURL**:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

---

### Student Endpoints

#### `GET /student`

Get current user's profile.

**Authentication**: Required

**Query Parameters**: None

**Success Response (200)**:
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "created_at": "2025-11-20T10:30:00Z",
  "updated_at": "2025-11-25T14:15:00Z"
}
```

**Error Responses**:
- `401`: Unauthorized (missing/invalid token)
- `404`: User not found

**Example cURL**:
```bash
curl -X GET http://localhost:3000/student \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

#### `PUT /student`

Update current user's profile.

**Authentication**: Required

**Request Body**:
```json
{
  "first_name": "Jane",
  "last_name": "Smith"
}
```

**Request Validation**:
- `first_name`: string, optional, max 255 chars
- `last_name`: string, optional, max 255 chars

**Success Response (200)**:
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "first_name": "Jane",
  "last_name": "Smith",
  "created_at": "2025-11-20T10:30:00Z",
  "updated_at": "2025-11-25T15:45:00Z"
}
```

**Error Responses**:
- `400`: Validation failed
- `401`: Unauthorized

**Example cURL**:
```bash
curl -X PUT http://localhost:3000/student \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Smith"
  }'
```

---

### Task Endpoints

#### `GET /task`

Get all tasks for current user.

**Authentication**: Required

**Query Parameters**:
- `status`: Filter by status (pending, in-progress, completed)
- `priority`: Filter by priority (low, normal, high)
- `category`: Filter by category
- `skip`: Pagination offset (default: 0)
- `take`: Number of results (default: 50)

**Success Response (200)**:
```json
[
  {
    "id": 1,
    "student_id": 1,
    "title": "Complete Assignment",
    "description": "Finish math homework",
    "status": "pending",
    "priority": "high",
    "category": "homework",
    "due_at": "2025-12-31T23:59:59Z",
    "created_at": "2025-11-20T10:30:00Z",
    "updated_at": "2025-11-20T10:30:00Z"
  },
  {
    "id": 2,
    "student_id": 1,
    "title": "Study for Exam",
    "description": "Prepare for math exam",
    "status": "in-progress",
    "priority": "high",
    "category": "exam",
    "due_at": "2025-12-15T10:00:00Z",
    "created_at": "2025-11-19T14:20:00Z",
    "updated_at": "2025-11-20T09:15:00Z"
  }
]
```

**Error Responses**:
- `401`: Unauthorized

**Example cURL**:
```bash
curl -X GET "http://localhost:3000/task?status=pending&priority=high" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

#### `GET /task/:id`

Get specific task by ID.

**Authentication**: Required

**Path Parameters**:
- `id`: Task ID (integer)

**Success Response (200)**:
```json
{
  "id": 1,
  "student_id": 1,
  "title": "Complete Assignment",
  "description": "Finish math homework",
  "status": "pending",
  "priority": "high",
  "category": "homework",
  "due_at": "2025-12-31T23:59:59Z",
  "created_at": "2025-11-20T10:30:00Z",
  "updated_at": "2025-11-20T10:30:00Z"
}
```

**Error Responses**:
- `401`: Unauthorized
- `404`: Task not found

**Example cURL**:
```bash
curl -X GET http://localhost:3000/task/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

#### `POST /task`

Create a new task.

**Authentication**: Required

**Request Body**:
```json
{
  "title": "Complete Assignment",
  "description": "Finish math homework",
  "due_at": "2025-12-31T23:59:59Z",
  "priority": "high",
  "category": "homework",
  "status": "pending"
}
```

**Request Validation**:
- `title`: string, required, max 255 chars
- `description`: string, optional, max 1000 chars
- `due_at`: ISO datetime, optional
- `priority`: enum (low, normal, high), default: normal
- `category`: string, optional, max 50 chars
- `status`: enum (pending, in-progress, completed), default: pending

**Success Response (201)**:
```json
{
  "id": 1,
  "student_id": 1,
  "title": "Complete Assignment",
  "description": "Finish math homework",
  "status": "pending",
  "priority": "high",
  "category": "homework",
  "due_at": "2025-12-31T23:59:59Z",
  "created_at": "2025-11-25T16:30:00Z",
  "updated_at": "2025-11-25T16:30:00Z"
}
```

**Error Responses**:
- `400`: Validation failed
- `401`: Unauthorized

**Example cURL**:
```bash
curl -X POST http://localhost:3000/task \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete Assignment",
    "description": "Finish math homework",
    "due_at": "2025-12-31T23:59:59Z",
    "priority": "high",
    "category": "homework"
  }'
```

---

#### `PUT /task/:id`

Update an existing task.

**Authentication**: Required

**Path Parameters**:
- `id`: Task ID (integer)

**Request Body** (all fields optional):
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "normal",
  "due_at": "2025-12-25T23:59:59Z",
  "category": "updated-category"
}
```

**Success Response (200)**:
```json
{
  "id": 1,
  "student_id": 1,
  "title": "Updated Title",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "normal",
  "category": "updated-category",
  "due_at": "2025-12-25T23:59:59Z",
  "created_at": "2025-11-20T10:30:00Z",
  "updated_at": "2025-11-25T16:35:00Z"
}
```

**Error Responses**:
- `400`: Validation failed
- `401`: Unauthorized
- `404`: Task not found

**Example cURL**:
```bash
curl -X PUT http://localhost:3000/task/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in-progress",
    "priority": "normal"
  }'
```

---

#### `DELETE /task/:id`

Delete a task.

**Authentication**: Required

**Path Parameters**:
- `id`: Task ID (integer)

**Success Response (204)**: No content

**Error Responses**:
- `401`: Unauthorized
- `404`: Task not found

**Example cURL**:
```bash
curl -X DELETE http://localhost:3000/task/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Schedule Endpoints

#### `GET /schedule`

Get all schedule entries for current user.

**Authentication**: Required

**Query Parameters**:
- `skip`: Pagination offset (default: 0)
- `take`: Number of results (default: 50)
- `date`: Filter by specific date (ISO format)

**Success Response (200)**:
```json
[
  {
    "id": 1,
    "student_id": 1,
    "title": "Math Class",
    "description": "Algebra lecture",
    "start_time": "2025-12-20T10:00:00Z",
    "end_time": "2025-12-20T11:00:00Z",
    "created_at": "2025-11-20T10:30:00Z",
    "updated_at": "2025-11-20T10:30:00Z"
  },
  {
    "id": 2,
    "student_id": 1,
    "title": "Study Group",
    "description": "Group study session",
    "start_time": "2025-12-20T14:00:00Z",
    "end_time": "2025-12-20T16:00:00Z",
    "created_at": "2025-11-19T14:20:00Z",
    "updated_at": "2025-11-19T14:20:00Z"
  }
]
```

**Error Responses**:
- `401`: Unauthorized

**Example cURL**:
```bash
curl -X GET http://localhost:3000/schedule \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

#### `GET /schedule/:id`

Get specific schedule entry by ID.

**Authentication**: Required

**Path Parameters**:
- `id`: Schedule entry ID (integer)

**Success Response (200)**:
```json
{
  "id": 1,
  "student_id": 1,
  "title": "Math Class",
  "description": "Algebra lecture",
  "start_time": "2025-12-20T10:00:00Z",
  "end_time": "2025-12-20T11:00:00Z",
  "created_at": "2025-11-20T10:30:00Z",
  "updated_at": "2025-11-20T10:30:00Z"
}
```

**Error Responses**:
- `401`: Unauthorized
- `404`: Schedule entry not found

**Example cURL**:
```bash
curl -X GET http://localhost:3000/schedule/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

#### `POST /schedule`

Create a new schedule entry.

**Authentication**: Required

**Request Body**:
```json
{
  "title": "Math Class",
  "description": "Algebra lecture",
  "start_time": "2025-12-20T10:00:00Z",
  "end_time": "2025-12-20T11:00:00Z"
}
```

**Request Validation**:
- `title`: string, required, max 255 chars
- `description`: string, optional, max 1000 chars
- `start_time`: ISO datetime, required
- `end_time`: ISO datetime, required
- Note: `end_time` must be after `start_time`

**Success Response (201)**:
```json
{
  "id": 1,
  "student_id": 1,
  "title": "Math Class",
  "description": "Algebra lecture",
  "start_time": "2025-12-20T10:00:00Z",
  "end_time": "2025-12-20T11:00:00Z",
  "created_at": "2025-11-25T16:40:00Z",
  "updated_at": "2025-11-25T16:40:00Z"
}
```

**Error Responses**:
- `400`: Validation failed (end_time before start_time, etc.)
- `401`: Unauthorized

**Example cURL**:
```bash
curl -X POST http://localhost:3000/schedule \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Math Class",
    "description": "Algebra lecture",
    "start_time": "2025-12-20T10:00:00Z",
    "end_time": "2025-12-20T11:00:00Z"
  }'
```

---

#### `PUT /schedule/:id`

Update a schedule entry.

**Authentication**: Required

**Path Parameters**:
- `id`: Schedule entry ID (integer)

**Request Body** (all fields optional):
```json
{
  "title": "Updated Class",
  "description": "Updated description",
  "start_time": "2025-12-20T10:30:00Z",
  "end_time": "2025-12-20T11:30:00Z"
}
```

**Success Response (200)**:
```json
{
  "id": 1,
  "student_id": 1,
  "title": "Updated Class",
  "description": "Updated description",
  "start_time": "2025-12-20T10:30:00Z",
  "end_time": "2025-12-20T11:30:00Z",
  "created_at": "2025-11-20T10:30:00Z",
  "updated_at": "2025-11-25T16:45:00Z"
}
```

**Error Responses**:
- `400`: Validation failed
- `401`: Unauthorized
- `404`: Schedule entry not found

**Example cURL**:
```bash
curl -X PUT http://localhost:3000/schedule/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Class",
    "start_time": "2025-12-20T10:30:00Z"
  }'
```

---

#### `DELETE /schedule/:id`

Delete a schedule entry.

**Authentication**: Required

**Path Parameters**:
- `id`: Schedule entry ID (integer)

**Success Response (204)**: No content

**Error Responses**:
- `401`: Unauthorized
- `404`: Schedule entry not found

**Example cURL**:
```bash
curl -X DELETE http://localhost:3000/schedule/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Request/Response Examples

### Complete User Registration Flow

**Request**:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTcwMDk0OTAwMCwiZXhwIjoxNzAwOTk5MDAwfQ.abcdef...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

---

### Create Task with Token

**Request**:
```bash
curl -X POST http://localhost:3000/task \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Study for Final Exam",
    "description": "Prepare chapters 1-10",
    "due_at": "2025-12-20T18:00:00Z",
    "priority": "high",
    "category": "exam"
  }'
```

**Response**:
```json
{
  "id": 5,
  "student_id": 1,
  "title": "Study for Final Exam",
  "description": "Prepare chapters 1-10",
  "status": "pending",
  "priority": "high",
  "category": "exam",
  "due_at": "2025-12-20T18:00:00Z",
  "created_at": "2025-11-25T16:50:00Z",
  "updated_at": "2025-11-25T16:50:00Z"
}
```

---

### Error Response Example

**Request** (invalid email):
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe",
    "email": "invalid-email",
    "password": "SecurePassword123!"
  }'
```

**Response (400)**:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "BadRequestException",
  "details": [
    {
      "field": "email",
      "message": "email must be a valid email"
    }
  ]
}
```

---

## Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no content to return |
| 400 | Bad Request | Invalid input or validation error |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Not authorized to access resource |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (e.g., duplicate email) |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Server temporarily unavailable |

---

## Rate Limiting

Currently, rate limiting is not implemented. Future versions may include:
- Request rate limits per user
- Endpoint-specific rate limits
- Rate limit headers in responses

---

## Best Practices

### 1. Always Include Authorization Header

```bash
# Correct
curl -H "Authorization: Bearer {token}" http://localhost:3000/student

# Incorrect - will return 401
curl http://localhost:3000/student
```

### 2. Use ISO 8601 Format for Dates

```json
{
  "due_at": "2025-12-31T23:59:59Z",
  "start_time": "2025-12-20T10:00:00Z"
}
```

### 3. Handle Validation Errors

```typescript
try {
  const response = await fetch('/task', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(taskData)
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Validation errors:', error.details);
  }
} catch (err) {
  console.error('Network error:', err);
}
```

### 4. Implement Retry Logic

```typescript
async function fetchWithRetry(url, options, retries = 3) {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}
```

### 5. Cache Responses When Appropriate

```typescript
const taskCache = new Map();

async function getCachedTasks() {
  if (taskCache.has('tasks')) {
    return taskCache.get('tasks');
  }
  
  const tasks = await fetchTasks();
  taskCache.set('tasks', tasks);
  return tasks;
}
```

### 6. Validate Dates

```typescript
function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

// Ensure end time is after start time
if (new Date(endTime) <= new Date(startTime)) {
  throw new Error('End time must be after start time');
}
```

---

## Debugging

### Enable Request Logging

In your frontend service:
```typescript
const response = await fetch(url, options);
console.log('Request:', url, options);
console.log('Response:', response.status, response.statusText);
const data = await response.json();
console.log('Data:', data);
```

### Test Endpoints with Postman

1. Set up Postman environment variable: `token = {access_token}`
2. Add Authorization header: `Bearer {{token}}`
3. Test each endpoint with sample data

### Use Swagger UI

Access the interactive API documentation at:
```
http://localhost:3000/docs
```

---

**For frontend component documentation, see [COMPONENTS.md](../frontend/COMPONENTS.md)**

**For general setup instructions, see [README.md](./README.md)**
