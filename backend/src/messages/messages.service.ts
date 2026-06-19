import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { MailService } from '../mail/mail.service';

export interface MessageInput {
  name: string;
  email: string;
  message: string;
}

@Injectable()
export class MessagesService {
  constructor(
    private readonly db: DbService,
    private readonly mail: MailService,
  ) {}

  create(input: MessageInput) {
    const now = new Date().toISOString();
    // 1) บันทึกลงฐานข้อมูลก่อนเสมอ — ข้อความจะไม่หายแม้อีเมลล่ม
    this.db.db
      .prepare(
        'INSERT INTO messages (name, email, message, createdAt) VALUES (?, ?, ?, ?)',
      )
      .run(input.name, input.email, input.message, now);

    // 2) แจ้งเตือนเข้าอีเมลแบบ best-effort (ไม่บล็อกการตอบกลับลูกค้า)
    const to = process.env.NOTIFY_EMAIL ?? this.ownerEmail();
    if (to) {
      void this.mail.sendContactNotification({ ...input, to });
    }

    return { ok: true, message: 'ส่งข้อความเรียบร้อยแล้ว' };
  }

  // อีเมลเจ้าของเว็บจากโปรไฟล์ (ใช้เป็นปลายทางสำรองถ้าไม่ตั้ง NOTIFY_EMAIL)
  private ownerEmail(): string | undefined {
    const profile = this.db.getSetting<{ email?: string }>('profile');
    return profile?.email?.trim() || undefined;
  }

  list() {
    return this.db.db
      .prepare('SELECT * FROM messages ORDER BY id DESC')
      .all();
  }

  markRead(id: number) {
    this.ensure(id);
    this.db.db.prepare('UPDATE messages SET isRead = 1 WHERE id = ?').run(id);
    return { ok: true };
  }

  remove(id: number) {
    this.ensure(id);
    this.db.db.prepare('DELETE FROM messages WHERE id = ?').run(id);
    return { ok: true };
  }

  private ensure(id: number) {
    const row = this.db.db
      .prepare('SELECT id FROM messages WHERE id = ?')
      .get(id);
    if (!row) throw new NotFoundException('ไม่พบข้อความ');
  }
}
