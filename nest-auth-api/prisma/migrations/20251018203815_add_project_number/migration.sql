/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,projectNumber]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectNumber` to the `Project` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add column with temporary default
ALTER TABLE "Project" ADD COLUMN "projectNumber" INTEGER NOT NULL DEFAULT 0;

-- Step 2: Update existing projects with proper project numbers per owner
WITH numbered_projects AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY "ownerId" ORDER BY "createdAt") as project_num
  FROM "Project"
)
UPDATE "Project" 
SET "projectNumber" = numbered_projects.project_num
FROM numbered_projects 
WHERE "Project".id = numbered_projects.id;

-- Step 3: Remove the default value
ALTER TABLE "Project" ALTER COLUMN "projectNumber" DROP DEFAULT;

-- Step 4: Create the unique constraint
CREATE UNIQUE INDEX "Project_ownerId_projectNumber_key" ON "Project"("ownerId", "projectNumber");
