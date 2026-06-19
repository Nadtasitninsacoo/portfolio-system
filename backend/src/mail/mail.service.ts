import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface ContactNotification {
  name: string;
  email: string;
  message: string;
  to: string; // อีเมลปลายทางที่จะรับแจ้งเตือน (เจ้าของเว็บ)
}

/**
 * บริการส่งอีเมลแจ้งเตือนผ่าน SMTP (มาตรฐาน) ด้วย nodemailer
 * - อ่านค่าทั้งหมดจาก environment variables เท่านั้น (ไม่ฮาร์ดโค้ดรหัส)
 * - ถ้ายังไม่ตั้งค่า SMTP จะปิดการทำงานเอง (no-op) โดยไม่ทำให้ระบบพัง
 * - ส่งเป็นข้อความล้วน (plain text) เพื่อกันการฝังโค้ด/HTML จาก input ผู้ใช้
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      const port = Number(process.env.SMTP_PORT ?? 587);
      this.transporter = nodemailer.createTransport({
        host,
        port,
        // 465 = SSL/TLS ตรงๆ, 587 = STARTTLS (มาตรฐานทั่วไป)
        secure: port === 465,
        auth: { user, pass },
      });
      this.logger.log(`เปิดใช้อีเมลแจ้งเตือนผ่าน SMTP: ${host}:${port}`);
    } else {
      this.logger.warn(
        'ยังไม่ได้ตั้งค่า SMTP — ข้ามการส่งอีเมลแจ้งเตือน (ข้อความลูกค้ายังถูกบันทึกตามปกติ)',
      );
    }
  }

  get enabled(): boolean {
    return this.transporter !== null;
  }

  // ส่งแบบ best-effort: error ถูกจับไว้ภายใน ไม่โยนต่อให้ผู้เรียก
  async sendContactNotification(input: ContactNotification): Promise<void> {
    if (!this.transporter) return;

    const from = process.env.MAIL_FROM ?? process.env.SMTP_USER!;
    try {
      await this.transporter.sendMail({
        from,
        to: input.to,
        replyTo: input.email, // กด reply แล้วตอบกลับลูกค้าได้ทันที
        subject: `📩 ข้อความใหม่จากเว็บไซต์ — ${input.name}`,
        text: [
          'มีลูกค้าส่งข้อความผ่านฟอร์มติดต่อบนเว็บไซต์',
          '',
          `ชื่อ : ${input.name}`,
          `อีเมล : ${input.email}`,
          '',
          'ข้อความ:',
          input.message,
          '',
          '— ตอบกลับ (Reply) อีเมลฉบับนี้เพื่อตอบลูกค้าได้เลย',
        ].join('\n'),
      });
      this.logger.log(`ส่งอีเมลแจ้งเตือนไปที่ ${input.to} สำเร็จ`);
    } catch (err) {
      // ไม่ทำให้คำขอของลูกค้าล้มเหลว — แค่ log ไว้
      this.logger.error(
        `ส่งอีเมลแจ้งเตือนไม่สำเร็จ: ${(err as Error).message}`,
      );
    }
  }
}
