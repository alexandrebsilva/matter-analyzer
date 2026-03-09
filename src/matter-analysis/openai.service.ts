import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { MATTER_SUMMARY_PROMPT } from './prompts/matter-summary.prompt';
import {
  MatterSummary,
  MATTER_SUMMARY_JSON_SCHEMA,
} from './dto/matter-summary.dto';

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      this.logger.warn(
        'OPENAI_API_KEY is not set. OpenAI calls will fail until configured.',
      );
    }
    this.client = new OpenAI({ apiKey: apiKey || 'not-set' });
    this.model = this.configService.get<string>('OPENAI_MODEL', 'gpt-4.1');
  }

  async summarizeMatter(documentText: string): Promise<MatterSummary> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: MATTER_SUMMARY_PROMPT },
          { role: 'user', content: documentText },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'matter_summary',
            strict: true,
            schema: MATTER_SUMMARY_JSON_SCHEMA,
          },
        },
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      return JSON.parse(content) as MatterSummary;
    } catch (error) {
      this.logger.error('OpenAI summarization failed', error);
      if (error instanceof OpenAI.APIError) {
        throw new InternalServerErrorException(
          `OpenAI API error: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Failed to generate matter summary',
      );
    }
  }

  async chat(message: string, context?: string): Promise<string> {
    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content:
            'You are a helpful legal matter analysis assistant. Answer questions about legal documents clearly and concisely. If you are given document context, base your answers on that context.',
        },
      ];

      if (context) {
        messages.push({
          role: 'user',
          content: `Document context:\n\n${context}\n\n---\n\nQuestion: ${message}`,
        });
      } else {
        messages.push({ role: 'user', content: message });
      }

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.3,
      });

      return response.choices[0]?.message?.content || 'No response generated.';
    } catch (error) {
      this.logger.error('OpenAI chat failed', error);
      if (error instanceof OpenAI.APIError) {
        throw new InternalServerErrorException(
          `OpenAI API error: ${error.message}`,
        );
      }
      throw new InternalServerErrorException('Failed to generate response');
    }
  }
}
