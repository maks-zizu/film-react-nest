import { Injectable } from '@nestjs/common';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';
import { v4 as uuid } from 'uuid';
import { FilmsRepository } from '../films/films.repository';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepo: FilmsRepository) {}

  async create(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const tickets = Array.isArray(dto.tickets) ? dto.tickets : [];
    await Promise.all(
      tickets.map((t) =>
        this.filmsRepo.markSeatTaken(t.film, t.session, `${t.row}:${t.seat}`),
      ),
    );

    return {
      total: tickets.length,
      items: tickets.map((t) => ({ ...t, id: uuid() })),
    };
  }
}
