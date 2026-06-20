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

  async list() {
    const rows = await this.db.all<ProjectRow>(
      'SELECT * FROM projects ORDER BY sort ASC, id ASC',
    );
    return rows.map((r) => this.parse(r));
  }

  async create(input: ProjectInput) {
    const now = new Date().toISOString();
    // ใช้ RETURNING * แทนการอ่าน lastInsertRowid — เพราะ Turso (libSQL remote)
    // ไม่ส่ง lastInsertRowid กลับมาเหมือน DB ไฟล์ในเครื่อง ทำให้เพิ่มผลงานไม่ได้บนคลาวด์
    const res = await this.db.run(
      `INSERT INTO projects (title, description, tags, link, imageUrl, images, gitLink, sort, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING *`,
      [
        input.title ?? 'โปรเจกต์ใหม่',
        input.description ?? '',
        JSON.stringify(input.tags ?? []),
        input.link ?? '',
        input.imageUrl ?? '',
        JSON.stringify(input.images ?? []),
        input.gitLink ?? '',
        input.sort ?? 0,
        now,
      ],
    );
    const row = res.rows[0] as unknown as ProjectRow;
    return this.parse(row);
  }

  async update(id: number, input: ProjectInput) {
    const existing = await this.findOne(id);
    await this.db.run(
      `UPDATE projects SET title=?, description=?, tags=?, link=?, imageUrl=?, images=?, gitLink=?, sort=? WHERE id=?`,
      [
        input.title ?? existing.title,
        input.description ?? existing.description,
        JSON.stringify(input.tags ?? existing.tags),
        input.link ?? existing.link,
        input.imageUrl ?? existing.imageUrl,
        JSON.stringify(input.images ?? existing.images),
        input.gitLink ?? existing.gitLink,
        input.sort ?? existing.sort,
        id,
      ],
    );
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.run('DELETE FROM projects WHERE id = ?', [id]);
    return { ok: true };
  }

  private async findOne(id: number) {
    const row = await this.db.get<ProjectRow>(
      'SELECT * FROM projects WHERE id = ?',
      [id],
    );
    if (!row) throw new NotFoundException('ไม่พบโปรเจกต์');
    return this.parse(row);
  }

  private parse(r: ProjectRow) {
    return {
      ...r,
      tags: JSON.parse(r.tags || '[]') as string[],
      images: JSON.parse(r.images || '[]') as string[],
      gitLink: r.gitLink || '',
    };
  }
}
