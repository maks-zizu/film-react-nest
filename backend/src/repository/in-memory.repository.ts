import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

export type Film = {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
};

export type Session = {
  id: string;
  filmId: string;
  daytime: string;
  hall: string;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
};

export type Ticket = {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
};

@Injectable()
export class InMemoryRepository {
  private films: Film[] = [
    {
      id: uuid(),
      rating: 2.9,
      director: 'Итан Райт',
      tags: ['Документальный'],
      title: 'Архитекторы общества',
      about:
        'Документальный фильм, исследующий влияние искусственного интеллекта...',
      description:
        'Документальный фильм Итана Райта исследует влияние технологий...',
      image: '/images/bg1s.jpg',
      cover: '/images/bg1c.jpg',
    },
  ];

  private sessions: Session[] = [];
  constructor() {
    const filmId = this.films[0].id;
    this.sessions = Array.from({ length: 2 }).map(() => ({
      id: uuid(),
      filmId,
      daytime: new Date().toISOString(),
      hall: '2',
      rows: 5,
      seats: 10,
      price: 350,
      taken: ['1:2'],
    }));
  }

  getFilms(): { total: number; items: Film[] } {
    return { total: this.films.length, items: this.films };
  }

  getScheduleByFilmId(filmId: string): {
    total: number;
    items: Omit<Session, 'filmId'>[];
  } {
    const items = this.sessions
      .filter((s) => s.filmId === filmId)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ filmId: _skip, ...rest }) => rest);
    return { total: items.length, items };
  }

  createOrder(tickets: Ticket[]) {
    for (const t of tickets) {
      const s = this.sessions.find(
        (x) => x.id === t.session && x.filmId === t.film,
      );
      if (!s) continue;
      const key = `${t.row}:${t.seat}`;
      if (!s.taken.includes(key)) s.taken.push(key);
    }
    return {
      total: tickets.length,
      items: tickets.map((t) => ({ ...t, id: uuid() })),
    };
  }
}
