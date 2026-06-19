import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';

export interface ProjectInput {
  title?: string;
  description?: string;
  tags?: string[];
  link?: string;
  imageUrl?: string;
  images?: string[];
  gitLink?: string;
  sort?: number;
}

interface ProjectRow {
  id: number;
  title: string;
  description: string;
  tags: string;
  link: string;
  imageUrl: string;
  images: string;
  gitLink: string;
  sort: number;
  createdAt: string;
}

@Injectable()
export class ProjectsService {
  constructor(private readonly db: DbService) {}

  list() {
    const rows = this.db.db
      .prepare('SELECT * FROM projects ORDER BY sort ASC, id ASC')
      .all() as unknown as ProjectRow[];
    return rows.map((r) => this.parse(r));
  }

  create(input: ProjectInput) {
    const now = new Date().toISOString();
    const info = this.db.db
      .prepare(
        `INSERT INTO projects (title, description, tags, link, imageUrl, images, gitLink, sort, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        input.title ?? 'โปรเจกต์ใหม่',
        input.description ?? '',
        JSON.stringify(input.tags ?? []),
        input.link ?? '',
        input.imageUrl ?? '',
        JSON.stringify(input.images ?? []),
        input.gitLink ?? '',
        input.sort ?? 0,
        now,
      );
    return this.findOne(Number(info.lastInsertRowid));
  }

  update(id: number, input: ProjectInput) {
    const existing = this.findOne(id);
    this.db.db
      .prepare(
        `UPDATE projects SET title=?, description=?, tags=?, link=?, imageUrl=?, images=?, gitLink=?, sort=? WHERE id=?`,
      )
      .run(
        input.title ?? existing.title,
        input.description ?? existing.description,
        JSON.stringify(input.tags ?? existing.tags),
        input.link ?? existing.link,
        input.imageUrl ?? existing.imageUrl,
        JSON.stringify(input.images ?? existing.images),
        input.gitLink ?? existing.gitLink,
        input.sort ?? existing.sort,
        id,
      );
    return this.findOne(id);
  }

  remove(id: number) {
    this.findOne(id);
    this.db.db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    return { ok: true };
  }

  private findOne(id: number) {
    const row = this.db.db
      .prepare('SELECT * FROM projects WHERE id = ?')
      .get(id) as unknown as ProjectRow | undefined;
    if (!row) throw new NotFoundException('ไม่พบโปรเจกต์');
    return this.parse(row);
  }

  // แปลงแถวจาก DB → object (tags/images เป็น JSON), เผื่อ DB เก่ายังไม่มีคอลัมน์
  private parse(r: ProjectRow) {
    return {
      ...r,
      tags: JSON.parse(r.tags || '[]') as string[],
      images: JSON.parse(r.images || '[]') as string[],
      gitLink: r.gitLink || '',
    };
  }
}
