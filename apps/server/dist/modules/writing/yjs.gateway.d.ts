import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { YjsService } from './yjs.service';
interface AuthorizedSocket extends Socket {
    userId?: string;
    chapterId?: string;
}
/**
 * Yjs WebSocket Gateway
 * 处理实时协作编辑的 WebSocket 连接
 * 房间格式：chapter:{chapterId}
 */
export declare class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private yjsService;
    server: Server;
    private readonly logger;
    constructor(jwtService: JwtService, yjsService: YjsService);
    /**
     * 验证 JWT token（从 query 参数获取）
     */
    private verifyToken;
    /**
     * 客户端连接时触发
     */
    handleConnection(client: AuthorizedSocket): Promise<void>;
    /**
     * 客户端断开连接时触发
     */
    handleDisconnect(client: AuthorizedSocket): Promise<void>;
    /**
     * 接收来自客户端的文档更新
     * 格式: { chapterId, update: number[] }
     */
    handleUpdate(client: AuthorizedSocket, payload: {
        chapterId: string;
        update: number[];
    }): void;
    /**
     * 接收来自客户端的 awareness 信息（光标位置、选择等）
     */
    handleAwarenessUpdate(client: AuthorizedSocket, payload: {
        chapterId: string;
        awareness: any;
    }): void;
    /**
     * 健康检查和统计端点
     */
    handlePing(client: Socket): void;
}
export {};
//# sourceMappingURL=yjs.gateway.d.ts.map