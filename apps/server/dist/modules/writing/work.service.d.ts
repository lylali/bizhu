import { Cache } from 'cache-manager';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkListResponse, WorkStatsResponse, CreateWorkRequest, WorkResponse } from '@shared';
export declare class WorkService {
    private prisma;
    private cacheManager;
    constructor(prisma: PrismaService, cacheManager: Cache);
    private getCurrentUserId;
    createWork(request: CreateWorkRequest): Promise<WorkResponse>;
    getWorks(): Promise<WorkListResponse>;
    getWorkStats(workId: string): Promise<WorkStatsResponse>;
    private getCachedWorkStats;
    private calculateWorkStats;
    private calculateStreak;
    private validateWorkOwnership;
}
//# sourceMappingURL=work.service.d.ts.map