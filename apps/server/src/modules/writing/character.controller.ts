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
import { CharacterService } from './character.service';
import {
  CharacterListResponse,
  CharacterWithRelationsResponse,
  CharacterResponse,
  CharacterRelationResponse,
  CharacterRelation,
} from '@shared';
import {
  CreateCharacterDto,
  UpdateCharacterDto,
  CreateCharacterRelationDto,
  UpdateCharacterPositionDto,
} from './character.dto';

@Controller('works/:workId/characters')
@UseGuards(JwtAuthGuard)
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get()
  async getAll(@Param('workId') workId: string): Promise<CharacterListResponse> {
    return this.characterService.getAll(workId);
  }

  @Get('relations')
  async getAllRelations(@Param('workId') workId: string): Promise<{ data: CharacterRelation[] }> {
    return this.characterService.getAllRelations(workId);
  }

  @Post()
  async create(
    @Param('workId') workId: string,
    @Body() request: CreateCharacterDto,
  ): Promise<CharacterResponse> {
    return this.characterService.create(workId, request);
  }

  @Get(':id')
  async getById(
    @Param('workId') workId: string,
    @Param('id') characterId: string,
  ): Promise<CharacterWithRelationsResponse> {
    return this.characterService.getById(workId, characterId);
  }

  @Patch(':id')
  async update(
    @Param('workId') workId: string,
    @Param('id') characterId: string,
    @Body() request: UpdateCharacterDto,
  ): Promise<CharacterResponse> {
    return this.characterService.update(workId, characterId, request);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(
    @Param('workId') workId: string,
    @Param('id') characterId: string,
  ): Promise<void> {
    return this.characterService.delete(workId, characterId);
  }

  @Patch(':id/position')
  async updatePosition(
    @Param('workId') workId: string,
    @Param('id') characterId: string,
    @Body() request: UpdateCharacterPositionDto,
  ): Promise<CharacterResponse> {
    return this.characterService.updatePosition(workId, characterId, request);
  }

  @Post('relations')
  async createRelation(
    @Param('workId') workId: string,
    @Body() request: CreateCharacterRelationDto,
  ): Promise<CharacterRelationResponse> {
    return this.characterService.createRelation(workId, request);
  }

  @Delete('relations/:relationId')
  @HttpCode(204)
  async deleteRelation(
    @Param('workId') workId: string,
    @Param('relationId') relationId: string,
  ): Promise<void> {
    return this.characterService.deleteRelation(workId, relationId);
  }
}