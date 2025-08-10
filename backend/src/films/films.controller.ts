import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly service: FilmsService) {}

  // GET /api/afisha/films
  @Get()
  list() {
    return this.service.list();
  }

  // GET /api/afisha/films/:id/schedule
  @Get(':id/schedule')
  schedule(@Param('id') id: string) {
    return this.service.schedule(id);
  }
}
