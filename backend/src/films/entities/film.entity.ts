import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';
import { jsonArrayTransformer } from '../../db/typeorm/transformers/json-array.transformer';

@Entity({ name: 'films' })
export class FilmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'double precision' })
  rating: number;

  @Column()
  director: string;

  @Column({ type: 'text', transformer: jsonArrayTransformer })
  tags: string[];

  @Column()
  image: string;

  @Column()
  cover: string;

  @Column()
  title: string;

  @Column()
  about: string;

  @Column()
  description: string;

  @OneToMany(() => ScheduleEntity, (s) => s.film)
  schedule: ScheduleEntity[];
}
