import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { YjsService } from './yjs.service';
import { YjsGateway } from './yjs.gateway';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [ChapterController],
  providers: [ChapterService, YjsService, YjsGateway],
  exports: [ChapterService, YjsService],
})
export class WritingModule {}