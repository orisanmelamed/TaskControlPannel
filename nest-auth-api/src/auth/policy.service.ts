import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PolicyService {
  constructor(private prisma: PrismaService) {}

  async assertProjectOwner(projectId: string, userId: string) {
    const p = await this.prisma.project.findUnique({ where: { id: projectId }, select: { ownerId: true } });
    if (!p) throw new ForbiddenException('Project not found');
    if (p.ownerId !== userId) throw new ForbiddenException('Not the project owner');
  }

  async canModifyTask(taskId: string, userId: string) {
    // Owner of the project OR assignee can modify certain fields
    const t = await this.prisma.task.findUnique({
      where: { id: taskId },
      select: { assignedTo: true, project: { select: { ownerId: true } } },
    });
    if (!t) throw new ForbiddenException('Task not found');
    return t.project.ownerId === userId || t.assignedTo === userId;
  }
}
