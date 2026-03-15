import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FilmEntity } from '../../films/entities/film.entity';
import { ScheduleEntity } from '../../films/entities/schedule.entity';

@Module({
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
  exports: [TypeOrmModule],
})
export class TypeormDatabaseModule {}
