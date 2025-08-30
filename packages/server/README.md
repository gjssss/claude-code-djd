# Claude Code Logs API

This implementation provides REST API endpoints for uploading and storing Claude Code logs in JSONL format using SQLite database with Drizzle ORM.

## API Endpoints

### POST /api/logs/upload

Upload Claude Code logs in JSONL format.

**Request:**
- Method: `POST`
- Content-Type: `text/plain` or `application/json`
- Body: JSONL format (one JSON object per line) or JSON array

**Response:**
```json
{
  "success": true,
  "message": "Successfully processed 3 log entries",
  "processedCount": 3,
  "skippedCount": 0
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/logs/upload \
  -H "Content-Type: text/plain" \
  --data-binary @logs.jsonl
```

### GET /api/logs

Retrieve stored logs with optional filtering.

**Query Parameters:**
- `limit`: Maximum number of records (default: 50, max: 1000)
- `sessionId`: Filter by session ID
- `type`: Filter by log type (user, assistant, system)
- `since`: Filter by timestamp (ISO format)

**Response:**
```json
{
  "success": true,
  "logs": [
    {
      "id": 1,
      "uuid": "920b3d49-efb2-4542-be47-3ba0c6dfcb59",
      "sessionId": "958555ae-c806-4d80-a008-e5f6e17322b9",
      "timestamp": "2025-08-30T07:16:24.956Z",
      "type": "user",
      "message": { "role": "user", "content": "hello" },
      "rawData": { /* complete original log entry */ }
    }
  ],
  "count": 1
}
```

**Examples:**
```bash
# Get all logs
curl http://localhost:3000/api/logs

# Get logs for specific session
curl "http://localhost:3000/api/logs?sessionId=958555ae-c806-4d80-a008-e5f6e17322b9"

# Get user messages only
curl "http://localhost:3000/api/logs?type=user"

# Get recent logs with limit
curl "http://localhost:3000/api/logs?limit=10&since=2025-08-30T07:00:00Z"
```

## Log Format

The API accepts Claude Code logs in JSONL format. Each log entry should contain:

**Required fields:**
- `uuid`: Unique identifier for the log entry
- `sessionId`: Session identifier
- `timestamp`: ISO timestamp
- `type`: Log type (user, assistant, system)

**Optional fields:**
- `parentUuid`: Parent log entry UUID
- `userType`: User type (e.g., "external")
- `version`: Claude Code version
- `gitBranch`: Git branch information
- `cwd`: Current working directory
- `isSidechain`: Boolean flag
- `message`: Message content (object)
- `requestId`: Request identifier
- `toolUseID`: Tool use identifier
- `level`: Log level (info, error, etc.)
- `content`: System message content
- `isMeta`: Boolean metadata flag

## Database Schema

The logs are stored in SQLite database with the following schema:

```sql
CREATE TABLE claude_code_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uuid TEXT NOT NULL UNIQUE,
  parent_uuid TEXT,
  session_id TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  type TEXT NOT NULL,
  user_type TEXT,
  version TEXT,
  git_branch TEXT,
  cwd TEXT,
  is_sidechain INTEGER,
  message TEXT,  -- JSON string
  request_id TEXT,
  tool_use_id TEXT,
  level TEXT,
  content TEXT,
  is_meta INTEGER,
  raw_data TEXT NOT NULL,  -- Complete JSON of original entry
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Features

- **Duplicate Prevention**: Uses UUID uniqueness constraint to prevent duplicate entries
- **Data Integrity**: Stores both parsed fields and complete raw data for audit trail
- **Flexible Input**: Accepts JSONL format, JSON arrays, or single JSON objects
- **Filtering**: Supports filtering by session, type, and timestamp
- **Error Handling**: Proper validation and error responses
- **Performance**: Uses SQLite with optimized indexes for fast queries

## Development

Start the development server:
```bash
cd packages/server
pnpm run dev
```

Test with sample data:
```bash
node test-logs.mjs
```

The database files are stored in `packages/server/data/` and are automatically excluded from version control.