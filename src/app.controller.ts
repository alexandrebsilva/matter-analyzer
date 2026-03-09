import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('api/health')
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
