import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('api/chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('message')
  async sendMessage(@Body() body: { message: string; fileId?: string }) {
    return this.chatService.processMessage(body.message, body.fileId);
  }
}
