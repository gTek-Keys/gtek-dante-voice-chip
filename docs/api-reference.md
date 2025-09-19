# API Reference

## Overview

The Dante Voice Chip backend provides RESTful APIs for accessing terminal monitoring data, managing tasks, and AI-powered analysis.

**Base URL**: `http://localhost:3001/api`

## Authentication

Currently, no authentication is required for local development. In production, consider implementing API keys or OAuth.

## Endpoints

### Health Check

**GET** `/health`

Returns service status and uptime information.

```json
{
  "status": "ok",
  "timestamp": "2023-09-18T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

---

## Stats API

### Get Today's Statistics

**GET** `/api/stats/today`

Returns aggregated statistics for the current day.

**Response:**
```json
{
  "commandsToday": 45,
  "errorsToday": 3,
  "activeMinutes": 120,
  "tasksGenerated": 2
}
```

### Get Command Frequency

**GET** `/api/stats/frequency?days=7`

Returns most frequently used commands.

**Query Parameters:**
- `days` (optional): Number of days to analyze (default: 7)

**Response:**
```json
[
  {
    "command": "git status",
    "frequency": 15
  },
  {
    "command": "npm install",
    "frequency": 8
  }
]
```

### Get Error Analysis

**GET** `/api/stats/errors?days=7`

Returns commands that frequently produce errors.

**Response:**
```json
[
  {
    "command": "npm test",
    "error_count": 5
  }
]
```

---

## Logs API

### Get Recent Commands

**GET** `/api/logs/recent?limit=50`

Returns recent terminal commands.

**Query Parameters:**
- `limit` (optional): Number of commands to return (default: 50)

**Response:**
```json
[
  {
    "id": "abc123",
    "timestamp": "2023-09-18T10:15:00.000Z",
    "command": "git status",
    "exit_code": 0,
    "directory": "/Users/user/project",
    "output": "On branch main..."
  }
]
```

### Search Commands

**GET** `/api/logs/search?q=git&start=2023-09-01&end=2023-09-18`

Search through command history.

**Query Parameters:**
- `q` (required): Search query
- `start` (optional): Start date (ISO string)
- `end` (optional): End date (ISO string)

### Export Logs

**GET** `/api/logs/export?start=2023-09-01&end=2023-09-18&format=json`

Export logs for a date range.

**Query Parameters:**
- `start` (required): Start date
- `end` (required): End date
- `format` (optional): Export format (json, csv)

---

## Tasks API

### Get Today's Tasks

**GET** `/api/tasks/today`

Returns tasks for the current day.

**Response:**
```json
[
  {
    "id": "task_123",
    "title": "Fix build errors",
    "description": "Multiple build failures detected",
    "priority": "high",
    "completed": false,
    "createdAt": "2023-09-18T09:00:00.000Z",
    "source": "ai-generated"
  }
]
```

### Create Task

**POST** `/api/tasks`

Create a new task.

**Request Body:**
```json
{
  "title": "Update dependencies",
  "description": "Update npm packages",
  "priority": "medium"
}
```

### Toggle Task Completion

**POST** `/api/tasks/:id/toggle`

Toggle the completion status of a task.

### Update Task

**PUT** `/api/tasks/:id`

Update task properties.

### Delete Task

**DELETE** `/api/tasks/:id`

Delete a task permanently.

---

## AI API

### Generate Summary

**POST** `/api/ai/summarize`

Generate an AI-powered activity summary.

**Request Body:**
```json
{
  "period": "today",
  "includeCommands": false
}
```

**Response:**
```json
{
  "summary": "You executed 45 commands today with 3 errors...",
  "suggestions": [
    "Review build configuration",
    "Consider using aliases"
  ]
}
```

### Analyze Command

**POST** `/api/ai/analyze-command`

Get AI analysis of a specific command.

**Request Body:**
```json
{
  "command": "rm -rf node_modules",
  "context": "Trying to fix npm issues"
}
```

### Process Voice Command

**POST** `/api/ai/voice-command`

Process voice input and determine intent.

**Request Body:**
```json
{
  "transcript": "summarize my terminal activity"
}
```

**Response:**
```json
{
  "transcript": "summarize my terminal activity",
  "response": "Generating your daily summary...",
  "action": "summarize",
  "timestamp": "2023-09-18T10:30:00.000Z"
}
```

---

## Voice API

### Process Audio

**POST** `/api/voice/process`

Transcribe audio and process as command.

**Request Body:**
```json
{
  "audioData": "base64-encoded-audio",
  "format": "wav"
}
```

### Synthesize Speech

**POST** `/api/voice/synthesize`

Convert text to speech.

**Request Body:**
```json
{
  "text": "Hello, this is your terminal summary",
  "voice": "alloy",
  "format": "mp3"
}
```

**Response:** Audio binary data

---

## WebSocket Events

### Live Log Stream

**GET** `/api/logs/live`

Server-Sent Events endpoint for real-time log streaming.

**Event Types:**
- `connected`: Initial connection
- `command`: New command executed
- `error`: Error occurred

---

## Error Responses

All endpoints return standardized error responses:

```json
{
  "error": "Error description",
  "message": "Detailed error message"
}
```

**HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

---

## Examples

### Complete Workflow

1. **Get today's stats:**
   ```bash
   curl http://localhost:3001/api/stats/today
   ```

2. **Search for git commands:**
   ```bash
   curl "http://localhost:3001/api/logs/search?q=git"
   ```

3. **Create a task:**
   ```bash
   curl -X POST http://localhost:3001/api/tasks \
     -H "Content-Type: application/json" \
     -d '{"title": "Review logs", "priority": "high"}'
   ```

4. **Generate AI summary:**
   ```bash
   curl -X POST http://localhost:3001/api/ai/summarize \
     -H "Content-Type: application/json" \
     -d '{"period": "today"}'
   ```