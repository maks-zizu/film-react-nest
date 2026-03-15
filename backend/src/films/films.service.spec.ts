import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { FilmsRepository } from './films.repository';

describe('FilmsService', () => {
  let service: FilmsService;
  let repository: {
    list: jest.Mock;
    getById: jest.Mock;
    ensureSeedIfEmpty: jest.Mock;
    markSeatTaken: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      list: jest.fn(),
      getById: jest.fn(),
      ensureSeedIfEmpty: jest.fn(),
      markSeatTaken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        { provide: FilmsRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns films list and maps entities to dto', async () => {
    repository.list.mockResolvedValue({
      total: 1,
      items: [
        {
          id: 'f1',
          rating: 8.9,
          director: 'D. Director',
          tags: ['drama'],
          title: 'Film',
          about: 'About',
          description: 'Description',
          image: 'image.jpg',
          cover: 'cover.jpg',
          schedule: [],
        },
      ],
    });

    await expect(service.list()).resolves.toEqual({
      total: 1,
      items: [
        {
          id: 'f1',
          rating: 8.9,
          director: 'D. Director',
          tags: ['drama'],
          title: 'Film',
          about: 'About',
          description: 'Description',
          image: 'image.jpg',
          cover: 'cover.jpg',
        },
      ],
    });

    expect(repository.ensureSeedIfEmpty).toHaveBeenCalledTimes(1);
    expect(repository.list).toHaveBeenCalledTimes(1);
  });

  it('returns schedule for film and normalizes hall to string', async () => {
    repository.getById.mockResolvedValue({
      id: 'f1',
      rating: 8.9,
      director: 'D. Director',
      tags: ['drama'],
      title: 'Film',
      about: 'About',
      description: 'Description',
      image: 'image.jpg',
      cover: 'cover.jpg',
      schedule: [
        {
          id: 'session-1',
          daytime: '10:00',
          hall: 2,
          rows: 10,
          seats: 20,
          price: 400,
          taken: ['1:1'],
        },
      ],
    });

    await expect(service.schedule('f1')).resolves.toEqual({
      total: 1,
      items: [
        {
          id: 'session-1',
          daytime: '10:00',
          hall: '2',
          rows: 10,
          seats: 20,
          price: 400,
          taken: ['1:1'],
        },
      ],
    });

    expect(repository.getById).toHaveBeenCalledWith('f1');
  });

  it('returns empty schedule when film does not exist', async () => {
    repository.getById.mockResolvedValue(null);

    await expect(service.schedule('missing')).resolves.toEqual({
      total: 0,
      items: [],
    });

    expect(repository.getById).toHaveBeenCalledWith('missing');
  });
});
