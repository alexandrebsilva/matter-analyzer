import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileParserService {
  private readonly supportedExtensions = new Set(['.txt', '.md', '.pdf']);

  async extractText(file: Express.Multer.File): Promise<string> {
    const ext = this.getExtension(file.originalname);

    if (!this.supportedExtensions.has(ext)) {
      throw new BadRequestException(
        `Unsupported file type: "${ext}". Supported types: ${[...this.supportedExtensions].join(', ')}`,
      );
    }

    switch (ext) {
      case '.txt':
      case '.md':
        return file.buffer.toString('utf-8');
      case '.pdf':
        return this.parsePdf(file.buffer);
      default:
        throw new BadRequestException(`Unsupported file type: "${ext}"`);
    }
  }

  private getExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    if (lastDot === -1) return '';
    return filename.slice(lastDot).toLowerCase();
  }

  private async parsePdf(buffer: Buffer): Promise<string> {
    try {
      const { PDFParse } = await import('pdf-parse');
      const parser = new PDFParse({ data: new Uint8Array(buffer) });
      const result = await parser.getText();
      await parser.destroy();
      return result.text;
    } catch {
      throw new BadRequestException(
        'Failed to parse PDF file. The file may be corrupted or password-protected.',
      );
    }
  }
}
