/*
  Warnings:

  - A unique constraint covering the columns `[projectId,taskNumber]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `taskNumber` to the `Task` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add column with temporary default
ALTER TABLE "Task" ADD COLUMN "taskNumber" INTEGER NOT NULL DEFAULT 0;

-- Step 2: Update existing tasks with proper task numbers per project
WITH numbered_tasks AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY "projectId" ORDER BY "createdAt") as task_num
  FROM "Task"
)
UPDATE "Task" 
SET "taskNumber" = numbered_tasks.task_num
FROM numbered_tasks 
WHERE "Task".id = numbered_tasks.id;

-- Step 3: Remove the default value
ALTER TABLE "Task" ALTER COLUMN "taskNumber" DROP DEFAULT;

-- Step 4: Create the unique constraint
CREATE UNIQUE INDEX "Task_projectId_taskNumber_key" ON "Task"("projectId", "taskNumber");
