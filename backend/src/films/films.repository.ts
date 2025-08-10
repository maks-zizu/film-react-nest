import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Film, FilmDocument } from './schemas/film.schema';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly FilmModel: Model<FilmDocument>,
  ) {}

  async list(): Promise<{ total: number; items: Film[] }> {
    const [items, total] = await Promise.all([
      this.FilmModel.find({}, { _id: 0, __v: 0 }).lean<Film[]>(),
      this.FilmModel.countDocuments({}),
    ]);
    return { total, items };
  }

  async getById(filmId: string): Promise<Film | null> {
    return this.FilmModel.findOne(
      { id: filmId },
      { _id: 0, __v: 0 },
    ).lean<Film | null>();
  }

  async ensureSeedIfEmpty(): Promise<void> {
    const count = await this.FilmModel.estimatedDocumentCount();
    if (count > 0) return;

    await this.FilmModel.create({
      id: uuid(),
      rating: 2.9,
      director: 'Итан Райт',
      tags: ['Документальный'],
      title: 'Архитекторы общества',
      about: 'Документальный фильм, исследующий влияние ИИ...',
      description:
        'Документальный фильм Итана Райта исследует влияние технологий...',
      image: '/images/bg1s.jpg',
      cover: '/images/bg1c.jpg',
      schedule: [
        {
          id: uuid(),
          daytime: new Date().toISOString(),
          hall: 2,
          rows: 5,
          seats: 10,
          price: 350,
          taken: ['1:2'],
        },
      ],
    } as Film);
  }

  async markSeatTaken(filmId: string, sessionId: string, seatKey: string) {
    await this.FilmModel.updateOne(
      {
        id: filmId,
        'schedule.id': sessionId,
        'schedule.taken': { $ne: seatKey },
      } as FilterQuery<FilmDocument>,
      { $push: { 'schedule.$.taken': seatKey } },
    );
  }
}
