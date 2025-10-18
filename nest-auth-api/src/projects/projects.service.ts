import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  create(ownerId: string, data: { name: string; description?: string }) {
    return this.prisma.project.create({ data: { ...data, ownerId } });
  }

  listForOwner(ownerId: string) {
    return this.prisma.project.findMany({ where: { ownerId }, orderBy: { createdAt: 'desc' } });
  }

  get(id: string) {
    return this.prisma.project.findUnique({ where: { id } });
  }

  update(id: string, data: { name?: string; description?: string }) {
    return this.prisma.project.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }
}