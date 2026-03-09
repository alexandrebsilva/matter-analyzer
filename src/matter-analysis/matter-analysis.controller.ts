import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MatterAnalysisService } from './matter-analysis.service';

@Controller('api/matter')
export class MatterAnalysisController {
  constructor(private matterAnalysisService: MatterAnalysisService) {}

  @Post('upload-and-summarize')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndSummarize(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: /(text\/plain|text\/markdown|application\/pdf|application\/octet-stream)/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.matterAnalysisService.uploadAndSummarize(file);
  }
}
