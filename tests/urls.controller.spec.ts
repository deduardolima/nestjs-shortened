import { Test, TestingModule } from '@nestjs/testing';
import { CreateUrlDto, UrlResponseDto, UrlWithOwnerResponseDto } from '../src/urls/dto/create-url.dto';
import { UpdateUrlDto } from '../src/urls/dto/update-url.dto';
import { UrlsController } from '../src/urls/urls.controller';
import { UrlsService } from '../src/urls/urls.service';

describe('UrlsController', () => {
  let controller: UrlsController;
  let service: UrlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [
        {
          provide: UrlsService,
          useValue: {
            create: jest.fn(),
            findUserUrls: jest.fn(),
            updateUrl: jest.fn(),
            deleteUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UrlsController>(UrlsController);
    service = module.get<UrlsService>(UrlsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new shortened URL', async () => {
      const createUrlDto: CreateUrlDto = { originalUrl: 'https://example.com' };
      const userId = 'userId';
      const expectedResult: UrlWithOwnerResponseDto = {
        id: '1',
        originalUrl: 'https://example.com',
        shortUrl: 'https://short.url/abc123',
        owner: { id: userId, email: 'user@example.com' },
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      const req = { user: { userId } };
      const result = await controller.create(createUrlDto, req);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createUrlDto.originalUrl, userId);
    });
  });

  describe('getUserUrls', () => {
    it('should return all shortened URLs for a user', async () => {
      const userId = 'userId';
      const expectedResult: UrlResponseDto[] = [
        {
          id: '1',
          originalUrl: 'https://example.com',
          shortUrl: 'https://short.url/abc123',
          clicks: 10,
          ownerId: '15dsa1d5sa1d5sa',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null
        },
      ];

      jest.spyOn(service, 'findUserUrls').mockResolvedValue(expectedResult);

      const req = { user: { userId } };
      const result = await controller.getUserUrls(req);

      expect(result).toEqual(expectedResult);
      expect(service.findUserUrls).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateUrl', () => {
    it('should update a URL', async () => {
      const id = '1';
      const updateUrlDto: UpdateUrlDto = { originalUrl: 'https://updated.com' };
      const userId = 'userId';
      const expectedResult: UrlResponseDto = {
        id: '1',
        originalUrl: 'https://example.com',
        shortUrl: 'https://short.url/abc123',
        clicks: 10,
        ownerId: '15dsa1d5sa1d5sa',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      };

      jest.spyOn(service, 'updateUrl').mockResolvedValue(expectedResult);

      const req = { user: { userId } };
      const result = await controller.updateUrl(id, updateUrlDto, req);

      expect(result).toEqual(expectedResult);
      expect(service.updateUrl).toHaveBeenCalledWith(id, updateUrlDto.originalUrl, userId);
    });
  });

  describe('deleteUrl', () => {
    it('should delete a URL', async () => {
      const id = '1';
      const userId = 'userId';

      jest.spyOn(service, 'deleteUrl').mockResolvedValue();

      const req = { user: { userId } };
      const result = await controller.deleteUrl(id, req);

      expect(result).toEqual({ message: 'URL deletada com sucesso' });
      expect(service.deleteUrl).toHaveBeenCalledWith(id, userId);
    });
  });
});
