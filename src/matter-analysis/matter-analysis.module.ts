import { Module } from '@nestjs/common';
import { MatterAnalysisController } from './matter-analysis.controller';
import { MatterAnalysisService } from './matter-analysis.service';
import { OpenAiService } from './openai.service';
import { FileParserService } from './file-parser.service';

@Module({
  controllers: [MatterAnalysisController],
  providers: [MatterAnalysisService, OpenAiService, FileParserService],
  exports: [MatterAnalysisService, OpenAiService],
})
export class MatterAnalysisModule {}
