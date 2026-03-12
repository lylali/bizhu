import { PrismaService } from '../../prisma/prisma.service';
import { ForeshadowListResponse, ForeshadowResponse } from '@shared';
import { CreateForeshadowDto, UpdateForeshadowDto } from './foreshadow.dto';
export declare class ForeshadowService {
    private prisma;
    constructor(prisma: PrismaService);
    private getCurrentUserId;
    private validateWorkOwnership;
    getAll(workId: string): Promise<ForeshadowListResponse>;
    create(workId: string, request: CreateForeshadowDto): Promise<ForeshadowResponse>;
    update(workId: string, foreshadowId: string, request: UpdateForeshadowDto): Promise<ForeshadowResponse>;
    delete(workId: string, foreshadowId: string): Promise<void>;
    private validateChapterOwnership;
}
//# sourceMappingURL=foreshadow.service.d.ts.map