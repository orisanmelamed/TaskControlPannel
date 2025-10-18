# Task Numbers - User-Friendly Task Identifiers

## Overview
Added user-friendly task numbers to replace UUIDs in API URLs. Each project now has tasks numbered 1, 2, 3, etc., making URLs more readable and logical.

## Task Numbering Logic
- **Project 1**: Task 1, Task 2, Task 3, ...
- **Project 2**: Task 1, Task 2, Task 3, ...
- **Project 3**: Task 1, Task 2, Task 3, ...

Each project has its own independent task numbering starting from 1.

## Updated API Endpoints

### Task Operations
- `GET /projects/:projectNumber/tasks` - List all tasks in project
- `GET /projects/:projectNumber/tasks/:taskNumber` - Get specific task by number
- `POST /projects/:projectNumber/tasks` - Create new task (auto-assigns next number)
- `PATCH /projects/:projectNumber/tasks/:taskNumber` - Update task by number
- `DELETE /projects/:projectNumber/tasks/:taskNumber` - Delete task by number

## URL Examples

### Before (UUID-based)
```
GET /projects/1/tasks/550e8400-e29b-41d4-a716-446655440000
PATCH /projects/1/tasks/550e8400-e29b-41d4-a716-446655440000
DELETE /projects/1/tasks/550e8400-e29b-41d4-a716-446655440000
```

### After (Number-based)
```
GET /projects/1/tasks/1
GET /projects/1/tasks/2
PATCH /projects/2/tasks/1
DELETE /projects/2/tasks/3
```

## Features

### Auto-incrementing Task Numbers
- When creating a new task, the system automatically assigns the next available number for that project
- Task numbers are scoped per project (Project 1 can have Task 1, Project 2 can also have Task 1)

### Logical Ordering
- Tasks are now ordered by task number (1, 2, 3...) instead of creation date
- More intuitive for users to reference and discuss tasks

### Backward Compatibility
- Internal UUID operations are preserved for database relationships
- Task UUIDs still exist for internal references and assignee relationships

## Database Changes

### New Field
- Added `taskNumber` field to Task model
- Created unique constraint on `(projectId, taskNumber)`
- Existing tasks were automatically assigned sequential numbers per project

### Migration
- `20251018212644_add_task_number/migration.sql` - Handles existing data properly
- Assigns numbers to existing tasks ordered by creation date

## API Response Example

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "taskNumber": 1,
  "title": "Setup authentication system",
  "description": "Implement JWT-based authentication",
  "status": "IN_PROGRESS", 
  "position": 0,
  "dueDate": "2025-10-25T00:00:00.000Z",
  "projectId": "project-uuid-here",
  "assignedTo": null,
  "createdAt": "2025-10-18T21:26:44.000Z",
  "updatedAt": "2025-10-19T10:30:15.000Z"
}
```

## Error Handling
- ✅ Invalid project numbers return 400 Bad Request
- ✅ Invalid task numbers return 400 Bad Request  
- ✅ Non-existent tasks return 404 Not Found
- ✅ Access control maintained (users can only access their own project tasks)

## Breaking Changes
⚠️ **Task endpoint parameters changed from UUID to number format**
- Old: `/projects/1/tasks/{task-uuid}`
- New: `/projects/1/tasks/{task-number}`

Frontend applications need to be updated to use task numbers instead of UUIDs for API calls.

## Benefits
1. **More Intuitive**: "Check task 3 in project 2" vs "Check task 550e8400-e29b-41d4-a716-446655440000"
2. **Easier Testing**: Can manually test endpoints with simple numbers
3. **Better UX**: Users can easily reference tasks in conversations
4. **Logical Organization**: Tasks numbered in order of creation per project