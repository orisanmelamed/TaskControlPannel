import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(ownerId: string, data: { name: string; description?: string }) {
    // Get the next project number for this owner
    const maxProject = await this.prisma.project.findFirst({
      where: { ownerId },
      orderBy: { projectNumber: 'desc' },
      select: { projectNumber: true },
    });
    
    const projectNumber = (maxProject?.projectNumber || 0) + 1;
    
    return this.prisma.project.create({ 
      data: { 
        ...data, 
        ownerId, 
        projectNumber 
      } 
    });
  }

  listForOwner(ownerId: string) {
    return this.prisma.project.findMany({ 
      where: { ownerId }, 
      orderBy: { projectNumber: 'asc' } 
    });
  }

  get(id: string) {
    return this.prisma.project.findUnique({ where: { id } });
  }

  getByNumber(ownerId: string, projectNumber: number) {
    return this.prisma.project.findUnique({ 
      where: { 
        ownerId_projectNumber: { 
          ownerId, 
          projectNumber 
        } 
      } 
    });
  }

  update(id: string, data: { name?: string; description?: string }) {
    return this.prisma.project.update({ where: { id }, data });
  }

  updateByNumber(ownerId: string, projectNumber: number, data: { name?: string; description?: string }) {
    return this.prisma.project.update({ 
      where: { 
        ownerId_projectNumber: { 
          ownerId, 
          projectNumber 
        } 
      }, 
      data 
    });
  }

  remove(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }

  removeByNumber(ownerId: string, projectNumber: number) {
    return this.prisma.project.delete({ 
      where: { 
        ownerId_projectNumber: { 
          ownerId, 
          projectNumber 
        } 
      } 
    });
  }
}