import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MatterAnalysisModule } from '../matter-analysis/matter-analysis.module';

@Module({
  imports: [MatterAnalysisModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
