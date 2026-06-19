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
  track(type: string, label: string, visitorId: string) {
    const t: EventType = type === 'click' ? 'click' : 'view';
    this.db.db
      .prepare(
        'INSERT INTO events (type, label, visitorId, createdAt) VALUES (?, ?, ?, ?)',
      )
      .run(
        t,
        (label || '').slice(0, 120),
        (visitorId || '').slice(0, 64),
        new Date().toISOString(),
      );
    return { ok: true };
  }

  // สรุปข้อมูลสำหรับกราฟในหน้าแอดมิน
  summary() {
    const db = this.db.db;
    const countNo = (sql: string): number =>
      (db.prepare(sql).get() as unknown as CountRow).n;

    const totalViews = countNo("SELECT COUNT(*) n FROM events WHERE type='view'");
    const totalClicks = countNo("SELECT COUNT(*) n FROM events WHERE type='click'");
    const uniqueVisitors = countNo(
      "SELECT COUNT(DISTINCT visitorId) n FROM events WHERE visitorId <> ''",
    );

    const today = new Date().toISOString().slice(0, 10);
    const todayViews = (
      db
        .prepare(
          "SELECT COUNT(*) n FROM events WHERE type='view' AND substr(createdAt,1,10)=?",
        )
        .get(today) as unknown as CountRow
    ).n;

    // ยอดวิวรายวัน 14 วันล่าสุด (เติมวันที่ไม่มีข้อมูลเป็น 0)
    const rows = db
      .prepare(
        "SELECT substr(createdAt,1,10) day, COUNT(*) n FROM events WHERE type='view' GROUP BY day",
      )
      .all() as unknown as DayRow[];
    const byDay = new Map(rows.map((r) => [r.day, r.n]));
    const now = new Date();
    const viewsByDay: { day: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      viewsByDay.push({ day: key, count: byDay.get(key) ?? 0 });
    }

    // คลิกยอดนิยม (ชอบกดตรงไหน) — สูงสุด 10 อันดับ
    const topClicks = (
      db
        .prepare(
          "SELECT label, COUNT(*) n FROM events WHERE type='click' AND label <> '' GROUP BY label ORDER BY n DESC LIMIT 10",
        )
        .all() as unknown as LabelRow[]
    ).map((r) => ({ label: r.label, count: r.n }));

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
