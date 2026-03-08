import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService implements OnModuleInit {
  private logger = new Logger('PrismaService');

  constructor(private configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    // TODO: Initialize Prisma client after schema is defined
    this.logger.log('Prisma initialized');
  }

  async onModuleDestroy(): Promise<void> {
    // TODO: Disconnect Prisma client
    this.logger.log('Prisma disconnected');
  }
}
