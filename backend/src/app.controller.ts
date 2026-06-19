import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // สำหรับ healthcheck ของโฮสต์ (Railway/Render) — ตอบ 200 เมื่อ service พร้อม
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
