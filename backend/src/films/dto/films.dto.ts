export class FilmDto {
  id!: string;
  rating!: number;
  director!: string;
  tags!: string[];
  title!: string;
  about!: string;
  description!: string;
  image!: string;
  cover!: string;
}
export class FilmsListResponseDto {
  total!: number;
  items!: FilmDto[];
}

export class ScheduleItemDto {
  id!: string;
  daytime!: string;
  hall!: string;
  rows!: number;
  seats!: number;
  price!: number;
  taken!: string[];
}

export class ScheduleResponseDto {
  total!: number;
  items!: ScheduleItemDto[];
}

import type { FilmModel } from '../types';

export const toFilmDto = (e: FilmModel) => ({
  id: e.id,
  rating: e.rating,
  director: e.director,
  tags: e.tags,
  title: e.title,
  about: e.about,
  description: e.description,
  image: e.image,
  cover: e.cover,
});

export const toScheduleDto = (e: FilmModel): ScheduleItemDto[] =>
  (e.schedule ?? []).map((s) => ({
    id: s.id,
    daytime: s.daytime,
    hall: String(s.hall),
    rows: s.rows,
    seats: s.seats,
    price: s.price,
    taken: s.taken ?? [],
  }));
