import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: {
    list: jest.Mock;
    schedule: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      list: jest.fn(),
      schedule: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [{ provide: FilmsService, useValue: service }],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns list from service', async () => {
    const expected = {
      total: 1,
      items: [
        {
          id: 'f1',
          rating: 8.1,
          director: 'Director',
          tags: ['drama'],
          title: 'Film 1',
          about: 'About',
          description: 'Description',
          image: 'img.jpg',
          cover: 'cover.jpg',
        },
      ],
    };
    service.list.mockResolvedValue(expected);

    await expect(controller.list()).resolves.toEqual(expected);
    expect(service.list).toHaveBeenCalledTimes(1);
  });

  it('returns schedule by film id', async () => {
    const expected = {
      total: 1,
      items: [
        {
          id: 'session-1',
          daytime: '10:00',
          hall: '1',
          rows: 10,
          seats: 20,
          price: 450,
          taken: ['1:1'],
        },
      ],
    };
    service.schedule.mockResolvedValue(expected);

    await expect(controller.schedule('f1')).resolves.toEqual(expected);
    expect(service.schedule).toHaveBeenCalledWith('f1');
    expect(service.schedule).toHaveBeenCalledTimes(1);
  });
});
