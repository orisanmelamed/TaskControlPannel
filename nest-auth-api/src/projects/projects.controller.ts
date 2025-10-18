import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PolicyService } from '../auth/policy.service';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private svc: ProjectsService, private policy: PolicyService) {}

  @Get()
  async myProjects(@Req() req: any) {
    return this.svc.listForOwner(req.user.sub);
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateProjectDto) {
    return this.svc.create(req.user.sub, dto);
  }

  @Get(':projectId')
  async get(@Req() req: any, @Param('projectId') projectId: string) {
    await this.policy.assertProjectOwner(projectId, req.user.sub);
    return this.svc.get(projectId);
  }

  @Patch(':projectId')
  async update(@Req() req: any, @Param('projectId') projectId: string, @Body() dto: UpdateProjectDto) {
    await this.policy.assertProjectOwner(projectId, req.user.sub);
    return this.svc.update(projectId, dto);
  }

  @Delete(':projectId')
  async remove(@Req() req: any, @Param('projectId') projectId: string) {
    await this.policy.assertProjectOwner(projectId, req.user.sub);
    return this.svc.remove(projectId);
  }
}