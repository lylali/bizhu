import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { YjsService } from './yjs.service';
import { YjsGateway } from './yjs.gateway';
import { OutlineController } from './outline.controller';
import { OutlineService } from './outline.service';
import { WorkController } from './work.controller';
import { WorkService } from './work.service';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';
import { ForeshadowController } from './foreshadow.controller';
import { ForeshadowService } from './foreshadow.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [ChapterController, OutlineController, WorkController, CharacterController, ForeshadowController],
  providers: [ChapterService, YjsService, YjsGateway, OutlineService, WorkService, CharacterService, ForeshadowService],
  exports: [ChapterService, YjsService, OutlineService, WorkService, CharacterService, ForeshadowService],
})
export class WritingModule {}