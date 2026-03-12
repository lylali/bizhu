import { CharacterService } from './character.service';
import { CharacterListResponse, CharacterWithRelationsResponse, CharacterResponse, CharacterRelationResponse, CharacterRelation } from '@shared';
import { CreateCharacterDto, UpdateCharacterDto, CreateCharacterRelationDto, UpdateCharacterPositionDto } from './character.dto';
export declare class CharacterController {
    private readonly characterService;
    constructor(characterService: CharacterService);
    getAll(workId: string): Promise<CharacterListResponse>;
    getAllRelations(workId: string): Promise<{
        data: CharacterRelation[];
    }>;
    create(workId: string, request: CreateCharacterDto): Promise<CharacterResponse>;
    getById(workId: string, characterId: string): Promise<CharacterWithRelationsResponse>;
    update(workId: string, characterId: string, request: UpdateCharacterDto): Promise<CharacterResponse>;
    delete(workId: string, characterId: string): Promise<void>;
    updatePosition(workId: string, characterId: string, request: UpdateCharacterPositionDto): Promise<CharacterResponse>;
    createRelation(workId: string, request: CreateCharacterRelationDto): Promise<CharacterRelationResponse>;
    deleteRelation(workId: string, relationId: string): Promise<void>;
}
//# sourceMappingURL=character.controller.d.ts.map