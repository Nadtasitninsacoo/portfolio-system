import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  // สาธารณะ: หน้าเว็บส่ง event เข้าชม/คลิก มาบันทึก
  @Post('track')
  track(
    @Body() body: { type?: string; label?: string; visitorId?: string },
  ) {
    return this.analytics.track(
      body.type ?? 'view',
      body.label ?? '',
      body.visitorId ?? '',
    );
  }

  // แอดมิน: ดึงสรุปสถิติไปแสดงกราฟ
  @Get('analytics/summary')
  @UseGuards(JwtAuthGuard)
  summary() {
    return this.analytics.summary();
  }
}
