import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // สาธารณะ: ฟอร์มติดต่อหน้าเว็บส่งมาที่นี่
  @Post('contact')
  submit(@Body() body: { name?: string; email?: string; message?: string }) {
    const name = body.name?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();
    if (!name || !email || !message) {
      throw new BadRequestException('กรุณากรอกชื่อ อีเมล และข้อความให้ครบถ้วน');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException('รูปแบบอีเมลไม่ถูกต้อง');
    }
    return this.messagesService.create({ name, email, message });
  }

  // แอดมิน: ดู/จัดการข้อความ
  @Get('messages')
  @UseGuards(JwtAuthGuard)
  list() {
    return this.messagesService.list();
  }

  @Patch('messages/:id/read')
  @UseGuards(JwtAuthGuard)
  markRead(@Param('id', ParseIntPipe) id: number) {
    return this.messagesService.markRead(id);
  }

  @Delete('messages/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.messagesService.remove(id);
  }
}
