import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: { username?: string; password?: string }) {
    const username = body.username?.trim();
    const password = body.password;
    if (!username || !password) {
      throw new BadRequestException('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
    }
    return this.authService.login(username, password);
  }
}
