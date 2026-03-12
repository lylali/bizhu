import { ForeshadowService } from './foreshadow.service';
import { ForeshadowListResponse, ForeshadowResponse } from '@shared';
import { CreateForeshadowDto, UpdateForeshadowDto } from './foreshadow.dto';
export declare class ForeshadowController {
    private readonly foreshadowService;
    constructor(foreshadowService: ForeshadowService);
    getAll(workId: string): Promise<ForeshadowListResponse>;
    create(workId: string, request: CreateForeshadowDto): Promise<ForeshadowResponse>;
    update(workId: string, foreshadowId: string, request: UpdateForeshadowDto): Promise<ForeshadowResponse>;
    delete(workId: string, foreshadowId: string): Promise<void>;
}
//# sourceMappingURL=foreshadow.controller.d.ts.map