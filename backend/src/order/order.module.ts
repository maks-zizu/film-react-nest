import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { InMemoryRepository } from '../repository/in-memory.repository';
import { FilmsModule } from 'src/films/films.module';

@Module({
  imports: [FilmsModule],
  controllers: [OrderController],
  providers: [OrderService, InMemoryRepository],
})
export class OrderModule {}
