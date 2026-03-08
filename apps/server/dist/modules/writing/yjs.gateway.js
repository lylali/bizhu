"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var YjsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.YjsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const yjs_service_1 = require("./yjs.service");
const Y = __importStar(require("yjs"));
/**
 * Yjs WebSocket Gateway
 * 处理实时协作编辑的 WebSocket 连接
 * 房间格式：chapter:{chapterId}
 */
let YjsGateway = YjsGateway_1 = class YjsGateway {
    constructor(jwtService, yjsService) {
        this.jwtService = jwtService;
        this.yjsService = yjsService;
        this.logger = new common_1.Logger(YjsGateway_1.name);
    }
    /**
     * 验证 JWT token（从 query 参数获取）
     */
    verifyToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            return payload && typeof payload === 'object' && 'userId' in payload ? payload : null;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.warn('Invalid token:', errorMessage);
            return null;
        }
    }
    /**
     * 客户端连接时触发
     */
    async handleConnection(client) {
        try {
            const token = client.handshake.query.token;
            const chapterId = client.handshake.query.chapterId;
            if (!token || !chapterId) {
                this.logger.warn('Missing token or chapterId');
                client.disconnect();
                return;
            }
            // 验证 JWT token
            const payload = this.verifyToken(token);
            if (!payload) {
                this.logger.warn('Unauthorized connection attempt');
                client.disconnect();
                return;
            }
            // 保存用户信息到 socket 对象
            client.userId = payload.userId;
            client.chapterId = chapterId;
            // 加入房间
            client.join(`chapter:${chapterId}`);
            this.logger.log(`Client ${client.id} connected to chapter:${chapterId} (user: ${payload.userId})`);
            // 发送当前文档状态给新连接的客户端
            const doc = this.yjsService.getOrCreateDocument(chapterId);
            const state = Y.encodeStateAsUpdate(doc);
            client.emit('sync:init', { state: Array.from(state) });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error('Connection error:', errorMessage);
            client.disconnect();
        }
    }
    /**
     * 客户端断开连接时触发
     */
    async handleDisconnect(client) {
        if (client.chapterId) {
            this.logger.log(`Client ${client.id} disconnected from chapter:${client.chapterId}`);
            const roomClients = this.server.sockets.adapter.rooms.get(`chapter:${client.chapterId}`);
            if (!roomClients || roomClients.size === 0) {
                this.logger.log(`No more clients in chapter:${client.chapterId}, saving document...`);
                await this.yjsService.saveDocumentNow(client.chapterId);
            }
        }
    }
    /**
     * 接收来自客户端的文档更新
     * 格式: { chapterId, update: number[] }
     */
    handleUpdate(client, payload) {
        try {
            const { chapterId, update } = payload;
            // 验证客户端权限（应该只能编辑自己房间的文档）
            if (client.chapterId !== chapterId) {
                this.logger.warn(`Unauthorized update attempt: ${client.id} tried to update ${chapterId}`);
                return;
            }
            // 应用更新到 Yjs 文档
            const updateArray = new Uint8Array(update);
            this.yjsService.applyUpdate(chapterId, updateArray);
            // 广播更新到同一房间的其他客户端
            client.broadcast.to(`chapter:${chapterId}`).emit('sync:update', {
                update: Array.from(updateArray),
            });
            this.logger.debug(`Update received for chapter ${chapterId}, size: ${update.length}`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error('Update processing error:', errorMessage);
        }
    }
    /**
     * 接收来自客户端的 awareness 信息（光标位置、选择等）
     */
    handleAwarenessUpdate(client, payload) {
        try {
            const { chapterId, awareness } = payload;
            // 验证权限
            if (client.chapterId !== chapterId) {
                return;
            }
            // 广播 awareness 到同一房间
            client.broadcast.to(`chapter:${chapterId}`).emit('awareness:update', {
                clientId: client.id,
                userId: client.userId,
                awareness,
            });
            this.logger.debug(`Awareness update from ${client.id} in chapter ${chapterId}`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error('Awareness update error:', errorMessage);
        }
    }
    /**
     * 健康检查和统计端点
     */
    handlePing(client) {
        client.emit('pong', {
            timestamp: Date.now(),
            documentCount: this.yjsService.getDocumentCount(),
        });
    }
};
exports.YjsGateway = YjsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], YjsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sync:update'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], YjsGateway.prototype, "handleUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('awareness:update'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], YjsGateway.prototype, "handleAwarenessUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], YjsGateway.prototype, "handlePing", null);
exports.YjsGateway = YjsGateway = YjsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        port: parseInt(process.env.WS_PORT || '3001'),
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
        },
    }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        yjs_service_1.YjsService])
], YjsGateway);
//# sourceMappingURL=yjs.gateway.js.map