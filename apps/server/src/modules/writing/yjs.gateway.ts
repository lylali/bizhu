import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { YjsService } from './yjs.service';
import * as Y from 'yjs';

interface AuthorizedSocket extends Socket {
  userId?: string;
  chapterId?: string;
}

/**
 * Yjs WebSocket Gateway
 * 处理实时协作编辑的 WebSocket 连接
 * 房间格式：chapter:{chapterId}
 */
@WebSocketGateway({
  port: parseInt(process.env.WS_PORT || '3001'),
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
})
@Injectable()
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  private readonly logger = new Logger(YjsGateway.name);

  constructor(
    private jwtService: JwtService,
    private yjsService: YjsService
  ) {}

  /**
   * 验证 JWT token（从 query 参数获取）
   */
  private verifyToken(token: string): any | null {
    try {
      const payload = this.jwtService.verify(token);
      return payload && typeof payload === 'object' && 'userId' in payload ? payload : null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn('Invalid token:', errorMessage);
      return null;
    }
  }

  /**
   * 客户端连接时触发
   */
  async handleConnection(client: AuthorizedSocket): Promise<void> {
    try {
      const token = client.handshake.query.token as string;
      const chapterId = client.handshake.query.chapterId as string;

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

      this.logger.log(
        `Client ${client.id} connected to chapter:${chapterId} (user: ${payload.userId})`
      );

      // 发送当前文档状态给新连接的客户端
      const doc = this.yjsService.getOrCreateDocument(chapterId);
      const state = Y.encodeStateAsUpdate(doc);
      client.emit('sync:init', { state: Array.from(state) });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Connection error:', errorMessage);
      client.disconnect();
    }
  }

  /**
   * 客户端断开连接时触发
   */
  async handleDisconnect(client: AuthorizedSocket): Promise<void> {
    if (client.chapterId) {
      this.logger.log(
        `Client ${client.id} disconnected from chapter:${client.chapterId}`
      );

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
  @SubscribeMessage('sync:update')
  handleUpdate(
    @ConnectedSocket() client: AuthorizedSocket,
    @MessageBody() payload: { chapterId: string; update: number[] }
  ): void {
    try {
      const { chapterId, update } = payload;

      // 验证客户端权限（应该只能编辑自己房间的文档）
      if (client.chapterId !== chapterId) {
        this.logger.warn(
          `Unauthorized update attempt: ${client.id} tried to update ${chapterId}`
        );
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Update processing error:', errorMessage);
    }
  }

  /**
   * 接收来自客户端的 awareness 信息（光标位置、选择等）
   */
  @SubscribeMessage('awareness:update')
  handleAwarenessUpdate(
    @ConnectedSocket() client: AuthorizedSocket,
    @MessageBody() payload: { chapterId: string; awareness: any }
  ): void {
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Awareness update error:', errorMessage);
    }
  }

  /**
   * 健康检查和统计端点
   */
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket): void {
    client.emit('pong', {
      timestamp: Date.now(),
      documentCount: this.yjsService.getDocumentCount(),
    });
  }
}
