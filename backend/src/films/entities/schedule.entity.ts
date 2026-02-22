import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FilmEntity } from './film.entity';
import { jsonArrayTransformer } from '../../db/typeorm/transformers/json-array.transformer';

@Entity({ name: 'schedules' })
export class ScheduleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // в SQL колонка названа "filmId"
  @Column({ name: 'filmId', type: 'uuid', nullable: true })
  filmId: string | null;

  @ManyToOne(() => FilmEntity, (f) => f.schedule, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'filmId' })
  film: FilmEntity;

  @Column()
  daytime: string;

  @Column({ type: 'int' })
  hall: number;

  @Column({ type: 'int' })
  rows: number;

  @Column({ type: 'int' })
  seats: number;

  @Column({ type: 'double precision' })
  price: number;

  @Column({ type: 'text', transformer: jsonArrayTransformer })
  taken: string[];
}
