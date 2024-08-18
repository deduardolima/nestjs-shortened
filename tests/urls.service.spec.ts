import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { UrlsService } from '../src/urls/urls.service';

describe('UrlsService', () => {
  let service: UrlsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: PrismaService,
          useValue: {
            url: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },
            $transaction: jest.fn().mockImplementation(async (cb) => cb(prisma)),
          },
        },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new URL', async () => {
    const url = {
      id: '1',
      originalUrl: 'http://test.com',
      shortUrl: 'abc123',
      clicks: 0,
      ownerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    jest.spyOn(service, 'generatorShortcut').mockResolvedValueOnce('abc123');
    jest.spyOn(prisma.url, 'create').mockResolvedValueOnce(url);

    const result = await service.create('http://test.com', '1');
    expect(result).toEqual(expect.objectContaining({
      id: '1',
      originalUrl: 'http://test.com',
      shortUrl: "http://localhost:3000/abc123",
      owner: null,
    }));
  });

  it('should throw a ConflictException if URL already exists', async () => {
    jest.spyOn(service, 'generatorShortcut').mockRejectedValueOnce(new ConflictException('URL já existe'));

    try {
      await service.create('http://test.com', '1');
    } catch (e) {
      expect(e).toBeInstanceOf(ConflictException);
    }
  });

  it('should return user URLs', async () => {
    const url = {
      id: '1',
      originalUrl: 'http://test.com',
      shortUrl: 'abc123',
      clicks: 0,
      ownerId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    const urls = [url, url];
    jest.spyOn(prisma.url, 'findMany').mockResolvedValueOnce(urls);

    const result = await service.findUserUrls('1');
    expect(result).toEqual(urls);
  });

  it('should throw NotFoundException if URL not found', async () => {
    jest.spyOn(prisma.url, 'findUnique').mockResolvedValueOnce(null);

    try {
      await service.findByShortUrl('shorty');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });
  it('should increment clicks successfully', async () => {
    const url = {
      id: '1',
      originalUrl: 'http://test.com',
      shortUrl: 'abc123',
      clicks: 0,
      ownerId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const updatedUrl = { ...url, clicks: url.clicks + 1 };

    jest.spyOn(prisma.url, 'update').mockResolvedValueOnce(updatedUrl);

    const result = await service.incrementClicks('abc123');
    expect(result.clicks).toBe(1);
  });

  it('should throw InternalServerErrorException on general error', async () => {
    jest.spyOn(prisma.url, 'update').mockImplementationOnce(() => {
      throw new InternalServerErrorException('General error');
    });

    try {
      await service.incrementClicks('abc123');
    } catch (e) {
      expect(e).toBeInstanceOf(InternalServerErrorException);
    }
  });


  it('should update the URL successfully', async () => {
    const url = {
      id: '1',
      originalUrl: 'http://old-url.com',
      ownerId: 'user1',
      shortUrl: 'abC123',
      clicks: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    const updatedUrl = { ...url, originalUrl: 'http://new-url.com' };

    jest.spyOn(prisma.url, 'findUnique').mockResolvedValueOnce(url);
    jest.spyOn(prisma.url, 'update').mockResolvedValueOnce(updatedUrl);

    const result = await service.updateUrl(url.id, 'http://new-url.com', 'user1');
    expect(result).toEqual(updatedUrl);
  });

  it('should throw NotFoundException if URL is not found', async () => {
    jest.spyOn(prisma.url, 'findUnique').mockResolvedValueOnce(null);

    try {
      await service.updateUrl('1', 'http://new-url.com', 'user1');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toBe('URL não encontrada ou você não tem permissão para atualizá-la');
    }
  });

  it('should throw BadRequestException on Prisma error', async () => {
    const url = {
      id: '1',
      originalUrl: 'http://old-url.com',
      shortUrl: 'abC123',
      clicks: 15,
      ownerId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    jest.spyOn(prisma.url, 'findUnique').mockResolvedValueOnce(url);
    jest.spyOn(prisma.url, 'update').mockImplementationOnce(() => {
      throw new BadRequestException('Prisma error');
    });

    try {
      await service.updateUrl('1', 'http://new-url.com', 'user1');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('should delete the URL successfully', async () => {
    const url = {
      id: '1',
      originalUrl: 'http://test.com',
      shortUrl: 'abC123',
      clicks: 15,
      ownerId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    jest.spyOn(prisma.url, 'findUnique').mockResolvedValueOnce(url);
    jest.spyOn(prisma.url, 'update').mockResolvedValueOnce({ ...url, deletedAt: new Date() });

    await service.deleteUrl('1', 'user1');
    expect(prisma.url.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { deletedAt: expect.any(Date) },
    });
  });

  it('should throw NotFoundException if URL is not found', async () => {
    jest.spyOn(prisma.url, 'findUnique').mockResolvedValueOnce(null);

    try {
      await service.deleteUrl('1', 'user1');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toBe('URL não encontrada ou você não tem permissão para deletá-la');
    }
  });

  it('should throw BadRequestException on Prisma error', async () => {
    const url = {
      id: '1',
      originalUrl: 'http://test.com',
      shortUrl: 'abC123',
      clicks: 15,
      ownerId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    jest.spyOn(prisma.url, 'findUnique').mockResolvedValueOnce(url);
    jest.spyOn(prisma.url, 'update').mockImplementationOnce(() => {
      throw new BadRequestException('Prisma error');
    });

    try {
      await service.deleteUrl('1', 'user1');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });
});

