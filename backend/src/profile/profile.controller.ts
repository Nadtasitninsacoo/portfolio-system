import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // สาธารณะ: หน้าเว็บดึงข้อมูลโปรไฟล์ไปแสดง
  @Get()
  get() {
    return this.profileService.get();
  }

  // แอดมิน: บันทึกข้อมูลโปรไฟล์
  @Put()
  @UseGuards(JwtAuthGuard)
  update(@Body() body: Record<string, unknown>) {
    return this.profileService.update(body);
  }
}
