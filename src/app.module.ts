import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { ChatModule } from './chat/chat.module';
import { MatterAnalysisModule } from './matter-analysis/matter-analysis.module';

const frontendDistPath = join(__dirname, '..', 'frontend', 'dist');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'change-me-in-production'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    ...(existsSync(frontendDistPath)
      ? [
          ServeStaticModule.forRoot({
            rootPath: frontendDistPath,
            exclude: ['/api/(.*)'],
          }),
        ]
      : []),
    AuthModule,
    ChatModule,
    MatterAnalysisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
