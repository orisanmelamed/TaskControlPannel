# Project Numbers - User-Friendly Project Identifiers

## Overview
Added user-friendly project numbers to replace UUIDs in API URLs. Each user now has projects numbered 1, 2, 3, etc., making URLs more readable.

## Changes Made

### Database Schema
- Added `projectNumber` field to the `Project` model
- Created unique constraint on `(ownerId, projectNumber)` 
- Existing projects were automatically assigned sequential numbers per owner

### API Endpoints Updated

#### Projects
- `GET /projects` - Lists projects with both UUID and projectNumber
- `GET /projects/:projectNumber` - Get project by friendly number (e.g., `/projects/1`)
- `PATCH /projects/:projectNumber` - Update project by number
- `DELETE /projects/:projectNumber` - Delete project by number

#### Tasks
- `GET /projects/:projectNumber/tasks` - Get tasks for project (e.g., `/projects/1/tasks`)
- `POST /projects/:projectNumber/tasks` - Create task in project
- `PATCH /projects/:projectNumber/tasks/:taskId` - Update task
- `DELETE /projects/:projectNumber/tasks/:taskId` - Delete task

## URL Examples

### Before (UUID-based)
```
GET /projects/dea25705-91ab-467c-bf66-62eb0233bd5f
GET /projects/dea25705-91ab-467c-bf66-62eb0233bd5f/tasks
```

### After (Number-based)
```
GET /projects/1
GET /projects/1/tasks
GET /projects/2
GET /projects/2/tasks
```

## Implementation Details

### Auto-incrementing Project Numbers
- When creating a new project, the system automatically assigns the next available number for that user
- Project numbers are scoped per user (User A can have project 1, User B can also have project 1)

### Backward Compatibility
- The UUID-based internal operations are preserved
- Tasks still use UUIDs internally for relationships
- Only the API routes were changed to use project numbers

### Error Handling
- Invalid project numbers (non-numeric) return a 400 Bad Request
- Non-existent projects return 404 Not Found
- Access control is maintained (users can only access their own projects)

## Code Changes

### Files Modified
1. `prisma/schema.prisma` - Added projectNumber field
2. `src/projects/projects.service.ts` - Added number-based CRUD methods
3. `src/projects/projects.controller.ts` - Updated routes to use project numbers
4. `src/tasks/tasks.controller.ts` - Updated routes to use project numbers
5. `src/auth/policy.service.ts` - Added number-based authorization check

### New Migration
- `20251018203815_add_project_number/migration.sql` - Adds projectNumber field and assigns numbers to existing projects

## Testing

You can now use friendly URLs like:
- `localhost:3000/projects/1`
- `localhost:3000/projects/1/tasks`
- `localhost:3000/projects/2/tasks`

Instead of the previous UUID-based URLs.