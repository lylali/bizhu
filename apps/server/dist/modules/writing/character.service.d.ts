import { PrismaService } from '../../prisma/prisma.service';
import { CharacterRelation, CharacterListResponse, CharacterWithRelationsResponse, CharacterResponse, CharacterRelationResponse } from '@shared';
import { CreateCharacterDto, UpdateCharacterDto, CreateCharacterRelationDto, UpdateCharacterPositionDto } from './character.dto';
export declare class CharacterService {
    private prisma;
    constructor(prisma: PrismaService);
    private getCurrentUserId;
    private validateWorkOwnership;
    getAll(workId: string): Promise<CharacterListResponse>;
    getAllRelations(workId: string): Promise<{
        data: CharacterRelation[];
    }>;
    getById(workId: string, characterId: string): Promise<CharacterWithRelationsResponse>;
    create(workId: string, request: CreateCharacterDto): Promise<CharacterResponse>;
    update(workId: string, characterId: string, request: UpdateCharacterDto): Promise<CharacterResponse>;
    delete(workId: string, characterId: string): Promise<void>;
    createRelation(workId: string, request: CreateCharacterRelationDto): Promise<CharacterRelationResponse>;
    deleteRelation(workId: string, relationId: string): Promise<void>;
    updatePosition(workId: string, characterId: string, request: UpdateCharacterPositionDto): Promise<CharacterResponse>;
    private mapCharacterToResponse;
    private mapCharacterWithRelationsToResponse;
    private mapRelationToResponse;
}
//# sourceMappingURL=character.service.d.ts.map