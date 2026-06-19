import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class ProfileService {
  constructor(private readonly db: DbService) {}

  async get(): Promise<Record<string, unknown>> {
    return (await this.db.getSetting<Record<string, unknown>>('profile')) ?? {};
  }

  async update(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const current = await this.get();
    const merged = { ...current, ...data };
    await this.db.setSetting('profile', merged);
    return merged;
  }
}
