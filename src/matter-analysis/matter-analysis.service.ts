import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { FileParserService } from './file-parser.service';
import { MatterSummary } from './dto/matter-summary.dto';

@Injectable()
export class MatterAnalysisService {
  private readonly logger = new Logger(MatterAnalysisService.name);
  private readonly documentStore = new Map<string, string>();

  constructor(
    private openAiService: OpenAiService,
    private fileParserService: FileParserService,
  ) {}

  async uploadAndSummarize(
    file: Express.Multer.File,
  ): Promise<{ fileId: string; fileName: string; summary: MatterSummary }> {
    this.logger.log(`Processing file: ${file.originalname} (${file.size} bytes)`);

    const text = await this.fileParserService.extractText(file);
    const fileId = crypto.randomUUID();
    this.documentStore.set(fileId, text);

    const summary = await this.openAiService.summarizeMatter(text);

    return { fileId, fileName: file.originalname, summary };
  }

  getDocumentText(fileId: string): string {
    const text = this.documentStore.get(fileId);
    if (!text) {
      throw new NotFoundException(`Document with ID "${fileId}" not found`);
    }
    return text;
  }
}
