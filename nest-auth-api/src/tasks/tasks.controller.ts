import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PolicyService } from '../auth/policy.service';
import { ProjectsService } from '../projects/projects.service';

@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/tasks')
export class TasksController {
  constructor(
    private tasks: TasksService,
    private policy: PolicyService,
    private projects: ProjectsService,
  ) {}

  @Get()
  async list(@Req() req: any, @Param('projectId') projectId: string) {
    await this.policy.assertProjectOwner(projectId, req.user.sub);
    return this.tasks.list(projectId);
  }

  @Post()
  async create(@Req() req: any, @Param('projectId') projectId: string, @Body() dto: CreateTaskDto) {
    await this.policy.assertProjectOwner(projectId, req.user.sub);
    return this.tasks.create(projectId, dto);
  }

  @Patch(':taskId')
  async update(@Req() req: any, @Param('projectId') projectId: string, @Param('taskId') taskId: string, @Body() dto: UpdateTaskDto) {
    // Owner can update all fields; assignee can update only status/position
    // Fast path: if owner, allow all
    try {
      await this.policy.assertProjectOwner(projectId, req.user.sub);
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
  async delete(@Req() req: any, @Param('projectId') projectId: string, @Param('taskId') taskId: string) {
    await this.policy.assertProjectOwner(projectId, req.user.sub);
    return this.tasks.remove(taskId);
  }
}