import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmsRepository } from '../films/films.repository';
import { MongoFilmsRepository } from '../films/repositories/mongo-films.repository';
import { PgFilmsRepository } from '../films/repositories/pg-films.repository';

import { Film, FilmSchema } from '../films/schemas/film.schema';
import { FilmEntity } from '../films/entities/film.entity';
import { ScheduleEntity } from '../films/entities/schedule.entity';

@Global()
@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    const driver = process.env.DATABASE_DRIVER ?? 'mongodb';

    if (driver === 'postgres') {
      return {
        module: DatabaseModule,
        global: true,
        imports: [
          ConfigModule,
          TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (cfg: ConfigService) => ({
              type: 'postgres',
              host: cfg.get<string>('DATABASE_HOST'),
              port: Number(cfg.get<string>('DATABASE_PORT') ?? 5432),
              username: cfg.get<string>('DATABASE_USERNAME'),
              password: cfg.get<string>('DATABASE_PASSWORD'),
              database: cfg.get<string>('DATABASE_NAME'),
              entities: [FilmEntity, ScheduleEntity],
              synchronize: false,
            }),
          }),
          TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
        ],
        providers: [
          PgFilmsRepository,
          { provide: FilmsRepository, useExisting: PgFilmsRepository },
        ],
        exports: [FilmsRepository],
      };
    }

    // mongodb
    return {
      module: DatabaseModule,
      global: true,
      imports: [
        ConfigModule,
        MongooseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (cfg: ConfigService) => ({
            uri:
              cfg.get<string>('DATABASE_URL') ??
              'mongodb://127.0.0.1:27017/prac',
          }),
        }),
        MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
      ],
      providers: [
        MongoFilmsRepository,
        { provide: FilmsRepository, useExisting: MongoFilmsRepository },
      ],
      exports: [FilmsRepository],
    };
  }
}
