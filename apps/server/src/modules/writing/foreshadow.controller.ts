import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ForeshadowService } from './foreshadow.service';
import {
  ForeshadowListResponse,
  ForeshadowResponse,
} from '@shared';
import {
  CreateForeshadowDto,
  UpdateForeshadowDto,
} from './foreshadow.dto';

@Controller('works/:workId/foreshadows')
@UseGuards(JwtAuthGuard)
export class ForeshadowController {
  constructor(private readonly foreshadowService: ForeshadowService) {}

  @Get()
  async getAll(@Param('workId') workId: string): Promise<ForeshadowListResponse> {
    return this.foreshadowService.getAll(workId);
  }

  @Post()
  async create(
    @Param('workId') workId: string,
    @Body() request: CreateForeshadowDto,
  ): Promise<ForeshadowResponse> {
    return this.foreshadowService.create(workId, request);
  }

  @Patch(':id')
  async update(
    @Param('workId') workId: string,
    @Param('id') foreshadowId: string,
    @Body() request: UpdateForeshadowDto,
  ): Promise<ForeshadowResponse> {
    return this.foreshadowService.update(workId, foreshadowId, request);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(
    @Param('workId') workId: string,
    @Param('id') foreshadowId: string,
  ): Promise<void> {
    return this.foreshadowService.delete(workId, foreshadowId);
  }
}