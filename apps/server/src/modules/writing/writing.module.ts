import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { YjsService } from './yjs.service';
import { YjsGateway } from './yjs.gateway';
import { OutlineController } from './outline.controller';
import { OutlineService } from './outline.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [ChapterController, OutlineController],
  providers: [ChapterService, YjsService, YjsGateway, OutlineService],
  exports: [ChapterService, YjsService, OutlineService],
})
export class WritingModule {}