import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WorkService } from './work.service';
import { WorkListResponse, WorkStatsResponse, CreateWorkRequest, WorkResponse } from '@shared';

@Controller('works')
@UseGuards(JwtAuthGuard)
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @Post()
  async createWork(@Body() request: CreateWorkRequest): Promise<WorkResponse> {
    return this.workService.createWork(request);
  }

  @Get()
  async getWorks(): Promise<WorkListResponse> {
    return this.workService.getWorks();
  }

  @Get(':workId/stats')
  async getWorkStats(@Param('workId') workId: string): Promise<WorkStatsResponse> {
    return this.workService.getWorkStats(workId);
  }
}