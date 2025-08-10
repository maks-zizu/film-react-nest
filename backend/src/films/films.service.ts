import { Injectable } from '@nestjs/common';
import { FilmsRepository } from './films.repository';
import {
  FilmsListResponseDto,
  ScheduleResponseDto,
  toFilmDto,
  toScheduleDto,
} from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly repo: FilmsRepository) {}

  async list(): Promise<FilmsListResponseDto> {
    await this.repo.ensureSeedIfEmpty();
    const data = await this.repo.list();
    return {
      total: data.total,
      items: data.items.map(toFilmDto),
    };
  }

  async schedule(filmId: string): Promise<ScheduleResponseDto> {
    const film = await this.repo.getById(filmId);
    const items = film ? toScheduleDto(film) : [];
    return { total: items.length, items };
  }
}
