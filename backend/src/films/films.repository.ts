import type { FilmModel } from './types';

export abstract class FilmsRepository {
  abstract list(): Promise<{ total: number; items: FilmModel[] }>;
  abstract getById(filmId: string): Promise<FilmModel | null>;
  abstract ensureSeedIfEmpty(): Promise<void>;
  abstract markSeatTaken(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<void>;
}
