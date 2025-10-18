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

  @Get(':projectNumber')
  async get(@Req() req: any, @Param('projectNumber') projectNumber: string) {
    const projectNum = parseInt(projectNumber);
    if (isNaN(projectNum)) {
      throw new (await import('@nestjs/common')).BadRequestException('Invalid project number');
    }
    await this.policy.assertProjectOwnerByNumber(projectNum, req.user.sub);
    return this.svc.getByNumber(req.user.sub, projectNum);
  }

  @Patch(':projectNumber')
  async update(@Req() req: any, @Param('projectNumber') projectNumber: string, @Body() dto: UpdateProjectDto) {
    const projectNum = parseInt(projectNumber);
    if (isNaN(projectNum)) {
      throw new (await import('@nestjs/common')).BadRequestException('Invalid project number');
    }
    await this.policy.assertProjectOwnerByNumber(projectNum, req.user.sub);
    return this.svc.updateByNumber(req.user.sub, projectNum, dto);
  }

  @Delete(':projectNumber')
  async remove(@Req() req: any, @Param('projectNumber') projectNumber: string) {
    const projectNum = parseInt(projectNumber);
    if (isNaN(projectNum)) {
      throw new (await import('@nestjs/common')).BadRequestException('Invalid project number');
    }
    await this.policy.assertProjectOwnerByNumber(projectNum, req.user.sub);
    return this.svc.removeByNumber(req.user.sub, projectNum);
  }
}