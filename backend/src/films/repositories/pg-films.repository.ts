import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilmsRepository } from '../films.repository';
import type { FilmModel } from '../types';
import { FilmEntity } from '../entities/film.entity';
import { ScheduleEntity } from '../entities/schedule.entity';

@Injectable()
export class PgFilmsRepository extends FilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmsRepo: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly schedulesRepo: Repository<ScheduleEntity>,
  ) {
    super();
  }

  async list(): Promise<{ total: number; items: FilmModel[] }> {
    const [items, total] = await this.filmsRepo.findAndCount();
    return { total, items };
  }

  async getById(filmId: string): Promise<FilmModel | null> {
    const film = await this.filmsRepo.findOne({
      where: { id: filmId },
      relations: { schedule: true },
    });
    return film ?? null;
  }

  async ensureSeedIfEmpty(): Promise<void> {
    const count = await this.filmsRepo.count();
    if (count > 0) return;
  }

  async markSeatTaken(filmId: string, sessionId: string, seatKey: string) {
    await this.schedulesRepo.manager.transaction(async (manager) => {
      const repo = manager.getRepository(ScheduleEntity);

      const row = await repo.findOne({
        where: { id: sessionId, filmId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!row) return;

      const taken = row.taken ?? [];
      if (taken.includes(seatKey)) return;

      row.taken = [...taken, seatKey];
      await repo.save(row);
    });
  }
}
