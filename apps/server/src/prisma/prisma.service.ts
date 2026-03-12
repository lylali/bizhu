import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private logger = new Logger('PrismaService');

  async onModuleInit(): Promise<void> {
    // skip real database connection in local/dev environment
    this.logger.log('Prisma initialization skipped (no database)');
  }

  async onModuleDestroy(): Promise<void> {
    // nothing to do when shutting down without a connection
    this.logger.log('Prisma shutdown skipped');
  }
}
