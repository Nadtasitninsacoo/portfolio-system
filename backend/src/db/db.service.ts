import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DatabaseSync } from 'node:sqlite';
import { join } from 'path';
import { defaultProfile, defaultProjects } from './defaults';

// บริการฐานข้อมูล SQLite (ใช้โมดูล node:sqlite ในตัวของ Node — ไม่ต้องคอมไพล์ native)
@Injectable()
export class DbService implements OnModuleInit {
  private readonly logger = new Logger(DbService.name);
  private database!: DatabaseSync;

  get db(): DatabaseSync {
    return this.database;
  }

  onModuleInit() {
    const path = process.env.DB_PATH ?? join(process.cwd(), 'data.sqlite');
    this.database = new DatabaseSync(path);
    this.createSchema();
    this.migrate();
    this.seed();
    this.logger.log(`ฐานข้อมูลพร้อมใช้งานที่ ${path}`);
  }

  private createSchema() {
    this.database.exec(`
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

  // เพิ่มคอลัมน์ใหม่ให้ตารางเดิมที่สร้างไว้ก่อนหน้า (ปลอดภัยกับ DB ที่มีข้อมูลอยู่แล้ว)
  private migrate() {
    const cols = this.database
      .prepare(`PRAGMA table_info(projects)`)
      .all() as { name: string }[];
    const names = new Set(cols.map((c) => c.name));
    if (!names.has('images')) {
      this.database.exec(
        `ALTER TABLE projects ADD COLUMN images TEXT NOT NULL DEFAULT '[]'`,
      );
    }
    if (!names.has('gitLink')) {
      this.database.exec(
        `ALTER TABLE projects ADD COLUMN gitLink TEXT NOT NULL DEFAULT ''`,
      );
    }
  }

  private seed() {
    const hasProfile = this.database
      .prepare('SELECT COUNT(*) AS n FROM settings WHERE key = ?')
      .get('profile') as { n: number };
    if (!hasProfile.n) {
      this.setSetting('profile', defaultProfile);
    }

    const projectCount = this.database
      .prepare('SELECT COUNT(*) AS n FROM projects')
      .get() as { n: number };
    if (!projectCount.n) {
      const now = new Date().toISOString();
      const insert = this.database.prepare(
        `INSERT INTO projects (title, description, tags, link, imageUrl, sort, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      );
      defaultProjects.forEach((p, i) => {
        insert.run(p.title, p.description, JSON.stringify(p.tags), p.link, p.imageUrl, i, now);
      });
    }
  }

  // ---- helpers สำหรับ settings (เก็บ JSON) ----
  getSetting<T>(key: string): T | null {
    const row = this.database
      .prepare('SELECT value FROM settings WHERE key = ?')
      .get(key) as { value: string } | undefined;
    return row ? (JSON.parse(row.value) as T) : null;
  }

  setSetting(key: string, value: unknown): void {
    this.database
      .prepare(
        `INSERT INTO settings (key, value) VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      )
      .run(key, JSON.stringify(value));
  }
}
