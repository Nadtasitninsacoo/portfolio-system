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

  async create(input: MessageInput) {
    const now = new Date().toISOString();
    // 1) บันทึกลงฐานข้อมูลก่อนเสมอ — ข้อความจะไม่หายแม้อีเมลล่ม
    await this.db.run(
      'INSERT INTO messages (name, email, message, createdAt) VALUES (?, ?, ?, ?)',
      [input.name, input.email, input.message, now],
    );

    // 2) แจ้งเตือนเข้าอีเมลแบบ best-effort (ไม่บล็อกการตอบกลับลูกค้า)
    const to = process.env.NOTIFY_EMAIL ?? (await this.ownerEmail());
    if (to) {
      void this.mail.sendContactNotification({ ...input, to });
    }

    return { ok: true, message: 'ส่งข้อความเรียบร้อยแล้ว' };
  }

  list() {
    return this.db.all('SELECT * FROM messages ORDER BY id DESC');
  }

  async markRead(id: number) {
    await this.ensure(id);
    await this.db.run('UPDATE messages SET isRead = 1 WHERE id = ?', [id]);
    return { ok: true };
  }

  async remove(id: number) {
    await this.ensure(id);
    await this.db.run('DELETE FROM messages WHERE id = ?', [id]);
    return { ok: true };
  }

  private async ensure(id: number) {
    const row = await this.db.get('SELECT id FROM messages WHERE id = ?', [id]);
    if (!row) throw new NotFoundException('ไม่พบข้อความ');
  }

  // อีเมลเจ้าของเว็บจากโปรไฟล์ (ปลายทางสำรองถ้าไม่ตั้ง NOTIFY_EMAIL)
  private async ownerEmail(): Promise<string | undefined> {
    const profile = await this.db.getSetting<{ email?: string }>('profile');
    return profile?.email?.trim() || undefined;
  }
}
