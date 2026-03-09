import { Injectable } from '@nestjs/common';
import { OpenAiService } from '../matter-analysis/openai.service';
import { MatterAnalysisService } from '../matter-analysis/matter-analysis.service';

@Injectable()
export class ChatService {
  constructor(
    private openAiService: OpenAiService,
    private matterAnalysisService: MatterAnalysisService,
  ) {}

  async processMessage(
    message: string,
    fileId?: string,
  ): Promise<{ response: string }> {
    let context: string | undefined;

    if (fileId) {
      context = this.matterAnalysisService.getDocumentText(fileId);
    }

    const response = await this.openAiService.chat(message, context);
    return { response };
  }
}
