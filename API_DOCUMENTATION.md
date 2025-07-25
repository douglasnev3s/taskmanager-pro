# TaskManager Pro API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, no authentication is required. This will be added in future versions.

## Endpoints

### Health Check
**GET** `/api/health`

Returns the API health status.

**Response:**
```json
{
  "status": "OK",
  "message": "TaskManager Pro API is running!",
  "timestamp": "2025-01-20T10:30:00.000Z",
  "environment": "development"
}
```

---

### Get All Tasks
**GET** `/api/tasks`

Retrieve a paginated list of tasks with optional filtering and sorting.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1, min: 1)
- `limit` (number, optional): Items per page (default: 10, min: 1, max: 100)
- `status` (string, optional): Filter by status (`todo`, `in-progress`, `completed`)
- `priority` (string, optional): Filter by priority (`low`, `medium`, `high`)
- `search` (string, optional): Search in title and description (max: 200 chars)
- `sortBy` (string, optional): Sort field (`createdAt`, `updatedAt`, `dueDate`, `priority`, `title`) (default: `createdAt`)
- `sortOrder` (string, optional): Sort order (`asc`, `desc`) (default: `desc`)

**Example Request:**
```bash
GET /api/tasks?page=1&limit=5&status=todo&priority=high&search=important&sortBy=dueDate&sortOrder=asc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "_id": "64f5b8a1234567890abcdef0",
        "title": "Complete project documentation",
        "description": "Write comprehensive API documentation",
        "status": "todo",
        "priority": "high",
        "dueDate": "2025-01-25T23:59:59.000Z",
        "tags": ["documentation", "urgent"],
        "createdAt": "2025-01-20T10:00:00.000Z",
        "updatedAt": "2025-01-20T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalTasks": 15,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### Get Task by ID
**GET** `/api/tasks/:id`

Retrieve a specific task by its ID.

**Parameters:**
- `id` (string, required): Valid MongoDB ObjectId

**Example Request:**
```bash
GET /api/tasks/64f5b8a1234567890abcdef0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f5b8a1234567890abcdef0",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "todo",
    "priority": "high",
    "dueDate": "2025-01-25T23:59:59.000Z",
    "tags": ["documentation", "urgent"],
    "createdAt": "2025-01-20T10:00:00.000Z",
    "updatedAt": "2025-01-20T10:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Task not found"
}
```

---

### Create Task
**POST** `/api/tasks`

Create a new task.

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "high",
  "status": "todo",
  "dueDate": "2025-01-25T23:59:59.000Z",
  "tags": ["documentation", "urgent"]
}
```

**Field Validation:**
- `title` (required): 1-200 characters
- `description` (optional): max 1000 characters, can be empty
- `priority` (optional): `low`, `medium`, `high` (default: `medium`)
- `status` (optional): `todo`, `in-progress`, `completed` (default: `todo`)
- `dueDate` (optional): ISO date string
- `tags` (optional): Array of strings, max 10 tags, each max 50 characters

**Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "64f5b8a1234567890abcdef0",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "todo",
    "priority": "high",
    "dueDate": "2025-01-25T23:59:59.000Z",
    "tags": ["documentation", "urgent"],
    "createdAt": "2025-01-20T10:00:00.000Z",
    "updatedAt": "2025-01-20T10:00:00.000Z"
  }
}
```

---

### Update Task
**PUT** `/api/tasks/:id`

Update an existing task.

**Parameters:**
- `id` (string, required): Valid MongoDB ObjectId

**Request Body (all fields optional):**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "priority": "medium",
  "status": "in-progress",
  "dueDate": "2025-01-30T23:59:59.000Z",
  "tags": ["updated", "in-progress"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "_id": "64f5b8a1234567890abcdef0",
    "title": "Updated task title",
    "description": "Updated description",
    "status": "in-progress",
    "priority": "medium",
    "dueDate": "2025-01-30T23:59:59.000Z",
    "tags": ["updated", "in-progress"],
    "createdAt": "2025-01-20T10:00:00.000Z",
    "updatedAt": "2025-01-20T15:30:00.000Z"
  }
}
```

---

### Delete Task
**DELETE** `/api/tasks/:id`

Delete a task by its ID.

**Parameters:**
- `id` (string, required): Valid MongoDB ObjectId

**Example Request:**
```bash
DELETE /api/tasks/64f5b8a1234567890abcdef0
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "_id": "64f5b8a1234567890abcdef0",
    "title": "Deleted task",
    "description": "This task was deleted",
    "status": "completed",
    "priority": "low",
    "createdAt": "2025-01-20T10:00:00.000Z",
    "updatedAt": "2025-01-20T10:00:00.000Z"
  }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": "Title is required, Priority must be one of: low, medium, high"
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "Task not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Failed to create task"
}
```

### Rate Limit (429)
```json
{
  "message": "Too many requests from this IP, please try again later."
}
```

---

## Example Usage with curl

### Create a task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn TypeScript",
    "description": "Complete TypeScript tutorial",
    "priority": "medium",
    "status": "todo",
    "tags": ["learning", "typescript"]
  }'
```

### Get all tasks
```bash
curl "http://localhost:5000/api/tasks?page=1&limit=10&status=todo"
```

### Update a task
```bash
curl -X PUT http://localhost:5000/api/tasks/64f5b8a1234567890abcdef0 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

### Delete a task
```bash
curl -X DELETE http://localhost:5000/api/tasks/64f5b8a1234567890abcdef0
```