import { PrismaClient } from '@prisma/client';

async function testTaskNumbering() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    
    // Check existing tasks
    const tasks = await prisma.task.findMany({
      include: {
        project: {
          select: {
            projectNumber: true,
            name: true
          }
        }
      },
      orderBy: [
        { project: { projectNumber: 'asc' } },
        { taskNumber: 'asc' }
      ]
    });
    
    console.log('Current tasks with numbers:');
    tasks.forEach(task => {
      console.log(`Project ${task.project.projectNumber} (${task.project.name}): Task ${task.taskNumber} - ${task.title}`);
    });
    
    // Test creating a new task in an existing project
    const projects = await prisma.project.findMany({
      orderBy: { projectNumber: 'asc' },
      take: 1
    });
    
    if (projects.length > 0) {
      const projectId = projects[0].id;
      
      // Get the next task number for this project
      const maxTask = await prisma.task.findFirst({
        where: { projectId },
        orderBy: { taskNumber: 'desc' },
        select: { taskNumber: true },
      });
      
      const nextTaskNumber = (maxTask?.taskNumber || 0) + 1;
      
      console.log(`\nNext task number for project ${projects[0].projectNumber} would be: ${nextTaskNumber}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTaskNumbering();