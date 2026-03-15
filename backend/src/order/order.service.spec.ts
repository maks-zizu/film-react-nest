import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { FilmsRepository } from '../films/films.repository';

describe('OrderService', () => {
  let service: OrderService;
  let filmsRepository: {
    list: jest.Mock;
    getById: jest.Mock;
    ensureSeedIfEmpty: jest.Mock;
    markSeatTaken: jest.Mock;
  };

  beforeEach(async () => {
    filmsRepository = {
      list: jest.fn(),
      getById: jest.fn(),
      ensureSeedIfEmpty: jest.fn(),
      markSeatTaken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: FilmsRepository, useValue: filmsRepository },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates order items and marks seats as taken', async () => {
    const dto = {
      tickets: [
        {
          film: 'f1',
          session: 's1',
          daytime: '10:00',
          row: 2,
          seat: 3,
          price: 400,
        },
        {
          film: 'f2',
          session: 's2',
          daytime: '13:00',
          row: 4,
          seat: 5,
          price: 550,
        },
      ],
    };

    const result = await service.create(dto);

    expect(filmsRepository.markSeatTaken).toHaveBeenCalledTimes(2);
    expect(filmsRepository.markSeatTaken).toHaveBeenNthCalledWith(
      1,
      'f1',
      's1',
      '2:3',
    );
    expect(filmsRepository.markSeatTaken).toHaveBeenNthCalledWith(
      2,
      'f2',
      's2',
      '4:5',
    );

    expect(result.total).toBe(2);
    expect(result.items[0]).toMatchObject(dto.tickets[0]);
    expect(result.items[1]).toMatchObject(dto.tickets[1]);
    expect(result.items[0].id).toEqual(expect.any(String));
    expect(result.items[1].id).toEqual(expect.any(String));
  });

  it('returns empty order when tickets are not passed', async () => {
    const result = await service.create({ tickets: undefined as any });

    expect(filmsRepository.markSeatTaken).not.toHaveBeenCalled();
    expect(result).toEqual({ total: 0, items: [] });
  });
});
