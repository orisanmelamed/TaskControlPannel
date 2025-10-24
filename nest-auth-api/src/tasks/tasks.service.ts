import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  list(projectId: string) {
    return this.prisma.task.findMany({
      where: { projectId },
      orderBy: [{ taskNumber: 'asc' }],
    });
  }

  get(id: string) {
    return this.prisma.task.findUnique({ where: { id } });
  }

  getByNumber(projectId: string, taskNumber: number) {
    return this.prisma.task.findUnique({ 
      where: { 
        projectId_taskNumber: { 
          projectId, 
          taskNumber 
        } 
      } 
    });
  }

  async create(projectId: string, data: {
    title: string; description?: string; status?: TaskStatus; position?: number; dueDate?: string; assignedTo?: string;
  }) {
    // Get the next task number for this project
    const maxTask = await this.prisma.task.findFirst({
      where: { projectId },
      orderBy: { taskNumber: 'desc' },
      select: { taskNumber: true },
    });
    
    const taskNumber = (maxTask?.taskNumber || 0) + 1;

    return this.prisma.task.create({
      data: {
        projectId,
        taskNumber,
        title: data.title,
        description: data.description,
        status: data.status ?? 'todo',
        position: data.position ?? 0,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        assignedTo: data.assignedTo,
      },
    });
  }

  update(id: string, data: {
    title?: string; description?: string; status?: TaskStatus; position?: number; dueDate?: string; assignedTo?: string;
  }) {
    return this.prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        position: data.position,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        assignedTo: data.assignedTo,
      },
    });
  }

  updateByNumber(projectId: string, taskNumber: number, data: {
    title?: string; description?: string; status?: TaskStatus; position?: number; dueDate?: string; assignedTo?: string;
  }) {
    return this.prisma.task.update({
      where: { 
        projectId_taskNumber: { 
          projectId, 
          taskNumber 
        } 
      },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        position: data.position,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        assignedTo: data.assignedTo,
      },
    });
  }

  remove(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }

  removeByNumber(projectId: string, taskNumber: number) {
    return this.prisma.task.delete({ 
      where: { 
        projectId_taskNumber: { 
          projectId, 
          taskNumber 
        } 
      } 
    });
  }
}