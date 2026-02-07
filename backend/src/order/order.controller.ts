import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  // POST /api/afisha/order
  @Post()
  create(@Body() body: CreateOrderDto) {
    const normalized: CreateOrderDto = Array.isArray(body)
      ? { tickets: body }
      : body;
    return this.service.create(normalized);
  }
}
