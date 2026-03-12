import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Character,
  CharacterWithRelations,
  CharacterRelation,
  CharacterListResponse,
  CharacterWithRelationsResponse,
  CharacterResponse,
  CharacterRelationResponse,
} from '@shared';
import {
  CreateCharacterDto,
  UpdateCharacterDto,
  CreateCharacterRelationDto,
  UpdateCharacterPositionDto,
} from './character.dto';

@Injectable()
export class CharacterService {
  constructor(private prisma: PrismaService) {}

  // 获取当前用户ID（暂时mock）
  private getCurrentUserId(): string {
    return 'user-123';
  }

  // 验证作品所有权
  private async validateWorkOwnership(workId: string): Promise<void> {
    const userId = this.getCurrentUserId();

    const work = await this.prisma.work.findUnique({
      where: { id: workId },
      select: { authorId: true },
    });

    if (!work) {
      throw new NotFoundException('作品不存在');
    }

    if (work.authorId !== userId) {
      throw new ForbiddenException('无权访问此作品');
    }
  }

  // 获取所有角色
  async getAll(workId: string): Promise<CharacterListResponse> {
    try {
      await this.validateWorkOwnership(workId);

      const characters = await this.prisma.character.findMany({
        where: { workId },
        include: {
          relationsFrom: true,
          relationsTo: true,
        },
        orderBy: { createdAt: 'asc' },
      });

      return {
        data: characters.map(char => this.mapCharacterToResponse(char)),
        meta: {
          total: characters.length,
        },
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error('获取角色列表失败');
    }
  }

  // 获取所有角色关系
  async getAllRelations(workId: string): Promise<{ data: CharacterRelation[] }> {
    try {
      await this.validateWorkOwnership(workId);

      const relations = await this.prisma.characterRelation.findMany({
        where: { workId },
        include: {
          from: true,
          to: true,
        },
        orderBy: { createdAt: 'asc' },
      });

      return {
        data: relations.map((relation) => this.mapRelationToResponse(relation)),
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error('获取角色关系列表失败');
    }
  }

  // 获取单个角色
  async getById(workId: string, characterId: string): Promise<CharacterWithRelationsResponse> {
    try {
      await this.validateWorkOwnership(workId);

      const character = await this.prisma.character.findFirst({
        where: { id: characterId, workId },
        include: {
          relationsFrom: true,
          relationsTo: true,
        },
      });

      if (!character) {
        throw new NotFoundException('角色不存在');
      }

      return {
        data: this.mapCharacterWithRelationsToResponse(character),
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error('获取角色失败');
    }
  }

  // 创建角色
  async create(workId: string, request: CreateCharacterDto): Promise<CharacterResponse> {
    try {
      await this.validateWorkOwnership(workId);

      const character = await this.prisma.character.create({
        data: {
          workId,
          name: request.name,
          aliases: request.aliases,
          gender: request.gender,
          age: request.age,
          description: request.description,
          appearance: request.appearance,
          personality: request.personality,
          faction: request.faction,
          notes: request.notes,
          tags: request.tags ? JSON.stringify(request.tags) : null,
          positionX: 0,
          positionY: 0,
        },
      });

      return {
        data: this.mapCharacterToResponse(character),
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error('创建角色失败');
    }
  }

  // 更新角色
  async update(
    workId: string,
    characterId: string,
    request: UpdateCharacterDto,
  ): Promise<CharacterResponse> {
    try {
      await this.validateWorkOwnership(workId);

      const character = await this.prisma.character.findFirst({
        where: { id: characterId, workId },
      });

      if (!character) {
        throw new NotFoundException('角色不存在');
      }

      const updated = await this.prisma.character.update({
        where: { id: characterId },
        data: {
          name: request.name ?? character.name,
          aliases: request.aliases ?? character.aliases,
          gender: request.gender ?? character.gender,
          age: request.age ?? character.age,
          description: request.description ?? character.description,
          appearance: request.appearance ?? character.appearance,
          personality: request.personality ?? character.personality,
          faction: request.faction ?? character.faction,
          notes: request.notes ?? character.notes,
          tags: request.tags ? JSON.stringify(request.tags) : character.tags,
        },
      });

      return {
        data: this.mapCharacterToResponse(updated),
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error('更新角色失败');
    }
  }

  // 删除角色（级联删除相关关系）
  async delete(workId: string, characterId: string): Promise<void> {
    try {
      await this.validateWorkOwnership(workId);

      const character = await this.prisma.character.findFirst({
        where: { id: characterId, workId },
      });

      if (!character) {
        throw new NotFoundException('角色不存在');
      }

      // 删除所有以该角色为from或to的关系
      await this.prisma.characterRelation.deleteMany({
        where: {
          OR: [{ fromId: characterId }, { toId: characterId }],
        },
      });

      // 删除角色
      await this.prisma.character.delete({
        where: { id: characterId },
      });
    } catch (error) {
      throw error instanceof Error ? error : new Error('删除角色失败');
    }
  }

  // 创建角色关系
  async createRelation(
    workId: string,
    request: CreateCharacterRelationDto,
  ): Promise<CharacterRelationResponse> {
    try {
      await this.validateWorkOwnership(workId);

      // 验证两个角色都存在且属于此作品
      const [fromCharacter, toCharacter] = await Promise.all([
        this.prisma.character.findFirst({
          where: { id: request.fromId, workId },
        }),
        this.prisma.character.findFirst({
          where: { id: request.toId, workId },
        }),
      ]);

      if (!fromCharacter || !toCharacter) {
        throw new NotFoundException('角色不存在');
      }

      const relation = await this.prisma.characterRelation.create({
        data: {
          workId,
          fromId: request.fromId,
          toId: request.toId,
          relationType: request.relationType,
        },
      });

      return {
        data: this.mapRelationToResponse(relation),
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error('创建角色关系失败');
    }
  }

  // 删除角色关系
  async deleteRelation(workId: string, relationId: string): Promise<void> {
    try {
      await this.validateWorkOwnership(workId);

      const relation = await this.prisma.characterRelation.findFirst({
        where: { id: relationId, workId },
      });

      if (!relation) {
        throw new NotFoundException('关系不存在');
      }

      await this.prisma.characterRelation.delete({
        where: { id: relationId },
      });
    } catch (error) {
      throw error instanceof Error ? error : new Error('删除角色关系失败');
    }
  }

  // 更新角色坐标
  async updatePosition(
    workId: string,
    characterId: string,
    request: UpdateCharacterPositionDto,
  ): Promise<CharacterResponse> {
    try {
      await this.validateWorkOwnership(workId);

      const character = await this.prisma.character.findFirst({
        where: { id: characterId, workId },
      });

      if (!character) {
        throw new NotFoundException('角色不存在');
      }

      const updated = await this.prisma.character.update({
        where: { id: characterId },
        data: {
          positionX: request.x,
          positionY: request.y,
        },
      });

      return {
        data: this.mapCharacterToResponse(updated),
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error('更新角色坐标失败');
    }
  }

  // 映射Character为response格式
  private mapCharacterToResponse(character: any): Character {
    return {
      id: character.id,
      workId: character.workId,
      name: character.name,
      aliases: character.aliases || undefined,
      gender: character.gender || undefined,
      age: character.age || undefined,
      description: character.description || undefined,
      appearance: character.appearance || undefined,
      personality: character.personality || undefined,
      faction: character.faction || undefined,
      notes: character.notes || undefined,
      tags: character.tags || undefined,
      positionX: character.positionX,
      positionY: character.positionY,
      createdAt: character.createdAt,
      updatedAt: character.updatedAt,
    };
  }

  // 映射Character为带关系的response格式
  private mapCharacterWithRelationsToResponse(character: any): CharacterWithRelations {
    return {
      id: character.id,
      workId: character.workId,
      name: character.name,
      aliases: character.aliases || undefined,
      gender: character.gender || undefined,
      age: character.age || undefined,
      description: character.description || undefined,
      appearance: character.appearance || undefined,
      personality: character.personality || undefined,
      faction: character.faction || undefined,
      notes: character.notes || undefined,
      tags: character.tags || undefined,
      positionX: character.positionX,
      positionY: character.positionY,
      createdAt: character.createdAt,
      updatedAt: character.updatedAt,
      relationsFrom: (character.relationsFrom || []).map((r: CharacterRelation) => this.mapRelationToResponse(r)),
      relationsTo: (character.relationsTo || []).map((r: CharacterRelation) => this.mapRelationToResponse(r)),
    };
  }

  // 映射Relation为response格式
  private mapRelationToResponse(relation: any): CharacterRelation {
    return {
      id: relation.id,
      workId: relation.workId,
      fromId: relation.fromId,
      toId: relation.toId,
      relationType: relation.relationType,
      createdAt: relation.createdAt,
      updatedAt: relation.updatedAt,
    };
  }
}