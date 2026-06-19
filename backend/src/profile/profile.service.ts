import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class ProfileService {
  constructor(private readonly db: DbService) {}

  get(): Record<string, unknown> {
    return this.db.getSetting<Record<string, unknown>>('profile') ?? {};
  }

  update(data: Record<string, unknown>): Record<string, unknown> {
    const current = this.get();
    const merged = { ...current, ...data };
    this.db.setSetting('profile', merged);
    return merged;
  }
}
