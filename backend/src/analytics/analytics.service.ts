import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

type EventType = 'view' | 'click';

interface CountRow {
  n: number;
}
interface DayRow {
  day: string;
  n: number;
}
interface LabelRow {
  label: string;
  n: number;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly db: DbService) {}

  // บันทึก event จากหน้าเว็บ (สาธารณะ) — view = เข้าชม, click = กดอะไร
  async track(type: string, label: string, visitorId: string) {
    const t: EventType = type === 'click' ? 'click' : 'view';
    await this.db.run(
      'INSERT INTO events (type, label, visitorId, createdAt) VALUES (?, ?, ?, ?)',
      [
        t,
        (label || '').slice(0, 120),
        (visitorId || '').slice(0, 64),
        new Date().toISOString(),
      ],
    );
    return { ok: true };
  }

  // สรุปข้อมูลสำหรับกราฟในหน้าแอดมิน
  async summary() {
    const countNo = async (sql: string): Promise<number> => {
      const r = await this.db.get<CountRow>(sql);
      return Number(r?.n ?? 0);
    };

    const totalViews = await countNo("SELECT COUNT(*) n FROM events WHERE type='view'");
    const totalClicks = await countNo("SELECT COUNT(*) n FROM events WHERE type='click'");
    const uniqueVisitors = await countNo(
      "SELECT COUNT(DISTINCT visitorId) n FROM events WHERE visitorId <> ''",
    );

    const today = new Date().toISOString().slice(0, 10);
    const todayRow = await this.db.get<CountRow>(
      "SELECT COUNT(*) n FROM events WHERE type='view' AND substr(createdAt,1,10)=?",
      [today],
    );
    const todayViews = Number(todayRow?.n ?? 0);

    // ยอดวิวรายวัน 14 วันล่าสุด (เติมวันที่ไม่มีข้อมูลเป็น 0)
    const rows = await this.db.all<DayRow>(
      "SELECT substr(createdAt,1,10) day, COUNT(*) n FROM events WHERE type='view' GROUP BY day",
    );
    const byDay = new Map(rows.map((r) => [r.day, Number(r.n)]));
    const now = new Date();
    const viewsByDay: { day: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      viewsByDay.push({ day: key, count: byDay.get(key) ?? 0 });
    }

    // คลิกยอดนิยม (ชอบกดตรงไหน) — สูงสุด 10 อันดับ
    const clickRows = await this.db.all<LabelRow>(
      "SELECT label, COUNT(*) n FROM events WHERE type='click' AND label <> '' GROUP BY label ORDER BY n DESC LIMIT 10",
    );
    const topClicks = clickRows.map((r) => ({ label: r.label, count: Number(r.n) }));

    return {
      totalViews,
      totalClicks,
      uniqueVisitors,
      todayViews,
      viewsByDay,
      topClicks,
    };
  }
}
