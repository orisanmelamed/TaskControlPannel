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

  @Get(':taskNumber')
  async get(@Req() req: any, @Param('projectNumber') projectNumber: string, @Param('taskNumber') taskNumber: string) {
    const projectNum = parseInt(projectNumber);
    const taskNum = parseInt(taskNumber);
    
    if (isNaN(projectNum)) {
      throw new (await import('@nestjs/common')).BadRequestException('Invalid project number');
    }
    if (isNaN(taskNum)) {
      throw new (await import('@nestjs/common')).BadRequestException('Invalid task number');
    }
    
    // Verify project ownership
    await this.policy.assertProjectOwnerByNumber(projectNum, req.user.sub);
    
    // Get the actual project to get its UUID
    const project = await this.projects.getByNumber(req.user.sub, projectNum);
    if (!project) {
      throw new (await import('@nestjs/common')).NotFoundException('Project not found');
    }
    
    // Get task by number within the project
    const task = await this.tasks.getByNumber(project.id, taskNum);
    if (!task) {
      throw new (await import('@nestjs/common')).NotFoundException('Task not found');
    }
    
    return task;
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

  @Patch(':taskNumber')
  async update(@Req() req: any, @Param('projectNumber') projectNumber: string, @Param('taskNumber') taskNumber: string, @Body() dto: UpdateTaskDto) {
    const projectNum = parseInt(projectNumber);
    const taskNum = parseInt(taskNumber);
    
    if (isNaN(projectNum)) {
      throw new (await import('@nestjs/common')).BadRequestException('Invalid project number');
    }
    if (isNaN(taskNum)) {
      throw new (await import('@nestjs/common')).BadRequestException('Invalid task number');
    }
    
    // Get the actual project to get its UUID
    const project = await this.projects.getByNumber(req.user.sub, projectNum);
    if (!project) {
      throw new (await import('@nestjs/common')).NotFoundException('Project not found');
    }
    
    // Owner can update all fields; assignee can update only status/position
    // Fast path: if owner, allow all
    try {
      await this.policy.assertProjectOwnerByNumber(projectNum, req.user.sub);
      return this.tasks.updateByNumber(project.id, taskNum, dto);
    } catch {
      // not owner: check if assignee and restrict fields
      const task = await this.tasks.getByNumber(project.id, taskNum);
      if (!task) {
        throw new (await import('@nestjs/common')).NotFoundException('Task not found');
      }
      
      const can = await this.policy.canModifyTask(task.id, req.user.sub);
      if (!can) throw new (await import('@nestjs/common')).ForbiddenException();
      const allowed = { status: dto.status, position: dto.position }; // assignee-limited
      return this.tasks.updateByNumber(project.id, taskNum, allowed as any);
    }
  }

  @Delete(':taskNumber')
  async delete(@Req() req: any, @Param('projectNumber') projectNumber: string, @Param('taskNumber') taskNumber: string) {
    const projectNum = parseInt(projectNumber);
    const taskNum = parseInt(taskNumber);
    
    if (isNaN(projectNum)) {
      throw new (await import('@nestjs/common')).BadRequestException('Invalid project number');
    }
    if (isNaN(taskNum)) {
      throw new (await import('@nestjs/common')).BadRequestException('Invalid task number');
    }
    
    await this.policy.assertProjectOwnerByNumber(projectNum, req.user.sub);
    
    // Get the actual project to get its UUID
    const project = await this.projects.getByNumber(req.user.sub, projectNum);
    if (!project) {
      throw new (await import('@nestjs/common')).NotFoundException('Project not found');
    }
    
    return this.tasks.removeByNumber(project.id, taskNum);
  }
}