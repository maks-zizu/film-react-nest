import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let service: {
    create: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: service }],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('passes object body to service as is', async () => {
    const body = {
      email: 'test@mail.com',
      tickets: [
        {
          film: 'f1',
          session: 's1',
          daytime: '10:00',
          row: 1,
          seat: 2,
          price: 500,
        },
      ],
    };
    const expected = { total: 1, items: [{ ...body.tickets[0], id: 'id-1' }] };
    service.create.mockResolvedValue(expected);

    await expect(controller.create(body)).resolves.toEqual(expected);
    expect(service.create).toHaveBeenCalledWith(body);
  });

  it('normalizes array body to tickets object', async () => {
    const body = [
      {
        film: 'f1',
        session: 's1',
        daytime: '10:00',
        row: 1,
        seat: 2,
        price: 500,
      },
    ];
    const expected = { total: 1, items: [{ ...body[0], id: 'id-1' }] };
    service.create.mockResolvedValue(expected);

    await expect(controller.create(body as any)).resolves.toEqual(expected);
    expect(service.create).toHaveBeenCalledWith({ tickets: body });
  });
});
