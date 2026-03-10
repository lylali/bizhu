import { WorkService } from './work.service';
import { WorkListResponse, WorkStatsResponse, CreateWorkRequest, WorkResponse } from '@shared';
export declare class WorkController {
    private readonly workService;
    constructor(workService: WorkService);
    createWork(request: CreateWorkRequest): Promise<WorkResponse>;
    getWorks(): Promise<WorkListResponse>;
    getWorkStats(workId: string): Promise<WorkStatsResponse>;
}
//# sourceMappingURL=work.controller.d.ts.map