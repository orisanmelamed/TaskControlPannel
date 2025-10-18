import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  list(projectId: string) {
    return this.prisma.task.findMany({
      where: { projectId },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    });
  }

  get(id: string) {
    return this.prisma.task.findUnique({ where: { id } });
  }

  create(projectId: string, data: {
    title: string; description?: string; status?: TaskStatus; position?: number; dueDate?: string; assignedTo?: string;
  }) {
    return this.prisma.task.create({
      data: {
        projectId,
        title: data.title,
        description: data.description,
        status: data.status ?? 'TODO',
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

  remove(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}