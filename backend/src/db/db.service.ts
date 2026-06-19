import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { createClient, type Client, type InValue } from '@libsql/client';
import { defaultProfile, defaultProjects } from './defaults';

// บริการฐานข้อมูล — ใช้ libSQL/Turso (SQLite-compatible) ทำงานบน cloud ได้
// local dev: ถ้าไม่ตั้ง TURSO_DATABASE_URL จะใช้ไฟล์ local.db ในเครื่อง
@Injectable()
export class DbService implements OnModuleInit {
  private readonly logger = new Logger(DbService.name);
  private client!: Client;

  async onModuleInit() {
    const url = process.env.TURSO_DATABASE_URL ?? 'file:local.db';
    const authToken = process.env.TURSO_AUTH_TOKEN;
    this.client = createClient({ url, authToken });
    await this.createSchema();
    await this.migrate();
    await this.seed();
    this.logger.log(
      `ฐานข้อมูลพร้อมใช้งาน (${url.startsWith('file:') ? 'local file' : 'Turso cloud'})`,
    );
  }

  // ---- helpers ----
  async all<T = Record<string, unknown>>(
    sql: string,
    args: InValue[] = [],
  ): Promise<T[]> {
    const rs = await this.client.execute({ sql, args });
    return rs.rows as unknown as T[];
  }

  async get<T = Record<string, unknown>>(
    sql: string,
    args: InValue[] = [],
  ): Promise<T | undefined> {
    const rs = await this.client.execute({ sql, args });
    return rs.rows[0] as unknown as T | undefined;
  }

  async run(sql: string, args: InValue[] = []) {
    return this.client.execute({ sql, args });
  }

  private async createSchema() {
    await this.client.executeMultiple(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        tags TEXT NOT NULL DEFAULT '[]',
        link TEXT NOT NULL DEFAULT '',
        imageUrl TEXT NOT NULL DEFAULT '',
        images TEXT NOT NULL DEFAULT '[]',
        gitLink TEXT NOT NULL DEFAULT '',
        sort INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        isRead INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        label TEXT NOT NULL DEFAULT '',
        visitorId TEXT NOT NULL DEFAULT '',
        createdAt TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_events_type_date ON events(type, createdAt);
    `);
  }

  // เพิ่มคอลัมน์ใหม่ให้ตารางเดิม (ปลอดภัยกับ DB ที่มีข้อมูลแล้ว)
  private async migrate() {
    const cols = await this.all<{ name: string }>(`PRAGMA table_info(projects)`);
    const names = new Set(cols.map((c) => c.name));
    if (!names.has('images')) {
      await this.run(`ALTER TABLE projects ADD COLUMN images TEXT NOT NULL DEFAULT '[]'`);
    }
    if (!names.has('gitLink')) {
      await this.run(`ALTER TABLE projects ADD COLUMN gitLink TEXT NOT NULL DEFAULT ''`);
    }
  }

  private async seed() {
    const profileCount = await this.get<{ n: number }>(
      'SELECT COUNT(*) AS n FROM settings WHERE key = ?',
      ['profile'],
    );
    if (!profileCount || Number(profileCount.n) === 0) {
      await this.setSetting('profile', defaultProfile);
    }

    const projectCount = await this.get<{ n: number }>(
      'SELECT COUNT(*) AS n FROM projects',
    );
    if (!projectCount || Number(projectCount.n) === 0) {
      const now = new Date().toISOString();
      for (let i = 0; i < defaultProjects.length; i++) {
        const p = defaultProjects[i];
        await this.run(
          `INSERT INTO projects (title, description, tags, link, imageUrl, sort, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [p.title, p.description, JSON.stringify(p.tags), p.link, p.imageUrl, i, now],
        );
      }
    }
  }

  // ---- settings (เก็บ JSON) ----
  async getSetting<T>(key: string): Promise<T | null> {
    const row = await this.get<{ value: string }>(
      'SELECT value FROM settings WHERE key = ?',
      [key],
    );
    return row ? (JSON.parse(row.value) as T) : null;
  }

  async setSetting(key: string, value: unknown): Promise<void> {
    await this.run(
      `INSERT INTO settings (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      [key, JSON.stringify(value)],
    );
  }
}
