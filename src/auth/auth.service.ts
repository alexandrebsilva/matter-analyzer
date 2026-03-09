import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly username: string;
  private readonly password: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.username = this.configService.get<string>('APP_USERNAME', 'admin');
    this.password = this.configService.get<string>('APP_PASSWORD', 'admin');
  }

  async login(dto: LoginDto) {
    if (dto.username !== this.username || dto.password !== this.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: dto.username, username: dto.username };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
