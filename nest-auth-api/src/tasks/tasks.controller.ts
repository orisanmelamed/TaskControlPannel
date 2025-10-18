import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PolicyService } from '../auth/policy.service';
import { ProjectsService } from '../projects/projects.service';

@UseGuards(JwtAuthGuard)
@Controller('projects/:projectNumber/tasks')
export class TasksController {
  constructor(
    private tasks: TasksService,
    private policy: PolicyService,
    private projects: ProjectsService,
  ) {}

  @Get()
  async list(@Req() req: any, @Param('projectNumber') projectNumber: string) {
    const projectNum = parseInt(projectNumber);
    if (isNaN(projectNum)) {
      throw new (await import('@nestjs/common')).BadRequestException('Invalid project number');
    }
    await this.policy.assertProjectOwnerByNumber(projectNum, req.user.sub);
    
    // Get the actual project to get its UUID for the tasks query
    const project = await this.projects.getByNumber(req.user.sub, projectNum);
    if (!project) {
      throw new (await import('@nestjs/common')).NotFoundException('Project not found');
    }
    
    return this.tasks.list(project.id);
  }

  @Post()
  async create(@Req() req: any, @Param('projectNumber') projectNumber: string, @Body() dto: CreateTaskDto) {
    const projectNum = parseInt(projectNumber);
    if (isNaN(projectNum)) {
      throw new (await import('@nestjs/common')).BadRequestException('Invalid project number');
    }
    await this.policy.assertProjectOwnerByNumber(projectNum, req.user.sub);
    
    // Get the actual project to get its UUID for the task creation
    const project = await this.projects.getByNumber(req.user.sub, projectNum);
    if (!project) {
      throw new (await import('@nestjs/common')).NotFoundException('Project not found');
    }
    
    return this.tasks.create(project.id, dto);
  }

  @Patch(':taskId')
  async update(@Req() req: any, @Param('projectNumber') projectNumber: string, @Param('taskId') taskId: string, @Body() dto: UpdateTaskDto) {
    const projectNum = parseInt(projectNumber);
    if (isNaN(projectNum)) {
      throw new (await import('@nestjs/common')).BadRequestException('Invalid project number');
    }
    
    // Owner can update all fields; assignee can update only status/position
    // Fast path: if owner, allow all
    try {
      await this.policy.assertProjectOwnerByNumber(projectNum, req.user.sub);
      return this.tasks.update(taskId, dto);
    } catch {
      // not owner: check if assignee and restrict fields
      const can = await this.policy.canModifyTask(taskId, req.user.sub);
      if (!can) throw new (await import('@nestjs/common')).ForbiddenException();
      const allowed = { status: dto.status, position: dto.position }; // assignee-limited
      return this.tasks.update(taskId, allowed as any);
    }
  }

  @Delete(':taskId')
  async delete(@Req() req: any, @Param('projectNumber') projectNumber: string, @Param('taskId') taskId: string) {
    const projectNum = parseInt(projectNumber);
    if (isNaN(projectNum)) {
      throw new (await import('@nestjs/common')).BadRequestException('Invalid project number');
    }
    await this.policy.assertProjectOwnerByNumber(projectNum, req.user.sub);
    return this.tasks.remove(taskId);
  }
}