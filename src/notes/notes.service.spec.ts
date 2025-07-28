import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, GoneException } from '@nestjs/common';

// Мокаем PrismaService
const mockPrismaService = {
  note: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  shareLink: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('NotesService', () => {
  let service: NotesService;
  let prisma: PrismaService;

  // Тестовые данные
  const userId = 'test-user-id';
  const noteId = 'test-note-id';
  const mockNote = {
    id: noteId,
    userId,
    title: 'Test Note',
    body: 'Test Body',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    prisma = module.get<PrismaService>(PrismaService);

    // Очищаем моки перед каждым тестом
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createShareLink', () => {
    it('should create share link', async () => {
      // Arrange
      mockPrismaService.note.findUnique.mockResolvedValue(mockNote);
      mockPrismaService.shareLink.create.mockResolvedValue({
        id: 'share-link-id',
        noteId,
        tokenHash: 'hashed-token',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        isActive: true,
        usedAt: null,
        createdAt: new Date(),
      });

      // Act
      const result = await service.createShareLink(noteId, userId, { ttlMinutes: 60 });

      // Assert
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('expiresAt');
      expect(result).toHaveProperty('url');
      expect(mockPrismaService.note.findUnique).toHaveBeenCalledWith({
        where: { id: noteId },
      });
    });

    it('should throw NotFoundException when note not found', async () => {
      // Arrange
      mockPrismaService.note.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
          service.createShareLink(noteId, userId, { ttlMinutes: 60 })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getNoteByToken', () => {
    it('should get note by valid token', async () => {
      // Arrange
      const mockShareLink = {
        id: 'share-link-id',
        noteId,
        tokenHash: 'hashed-token',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 час в будущем
        isActive: true,
        usedAt: null,
        note: mockNote,
      };

      mockPrismaService.shareLink.findUnique.mockResolvedValue(mockShareLink);
      mockPrismaService.shareLink.update.mockResolvedValue({});

      // Act
      const result = await service.getNoteByToken('valid-token');

      // Assert
      expect(result).toEqual(mockNote);
      expect(mockPrismaService.shareLink.update).toHaveBeenCalledWith({
        where: { id: mockShareLink.id },
        data: { usedAt: expect.any(Date) },
      });
    });

    it('should throw NotFoundException for invalid token', async () => {
      // Arrange
      mockPrismaService.shareLink.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getNoteByToken('invalid-token'))
          .rejects.toThrow(NotFoundException);
    });

    it('should throw GoneException for expired token', async () => {
      // Arrange
      const expiredShareLink = {
        id: 'share-link-id',
        noteId,
        tokenHash: 'hashed-token',
        expiresAt: new Date(Date.now() - 60 * 60 * 1000), // 1 час назад
        isActive: true,
        usedAt: null,
        note: mockNote,
      };

      mockPrismaService.shareLink.findUnique.mockResolvedValue(expiredShareLink);

      // Act & Assert
      await expect(service.getNoteByToken('expired-token'))
          .rejects.toThrow(GoneException);
    });

    it('should throw GoneException for used token', async () => {
      // Arrange
      const usedShareLink = {
        id: 'share-link-id',
        noteId,
        tokenHash: 'hashed-token',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        isActive: true,
        usedAt: new Date(), // Уже использованная ссылка
        note: mockNote,
      };

      mockPrismaService.shareLink.findUnique.mockResolvedValue(usedShareLink);

      // Act & Assert
      await expect(service.getNoteByToken('used-token'))
          .rejects.toThrow(GoneException);
    });

    it('should throw GoneException for revoked token', async () => {
      // Arrange
      const revokedShareLink = {
        id: 'share-link-id',
        noteId,
        tokenHash: 'hashed-token',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        isActive: false, // Отозванная ссылка
        usedAt: null,
        note: mockNote,
      };

      mockPrismaService.shareLink.findUnique.mockResolvedValue(revokedShareLink);

      // Act & Assert
      await expect(service.getNoteByToken('revoked-token'))
          .rejects.toThrow(GoneException);
    });
  });

  describe('revokeShareLink', () => {
    it('should revoke share link', async () => {
      // Arrange
      mockPrismaService.note.findUnique.mockResolvedValue(mockNote);
      mockPrismaService.shareLink.findFirst.mockResolvedValue({
        id: 'share-link-id',
        noteId,
      });
      mockPrismaService.shareLink.update.mockResolvedValue({
        id: 'share-link-id',
        isActive: false,
      });

      // Act
      const result = await service.revokeShareLink(noteId, 'share-link-id', userId);

      // Assert
      expect(result.isActive).toBe(false);
      expect(mockPrismaService.shareLink.update).toHaveBeenCalledWith({
        where: { id: 'share-link-id' },
        data: { isActive: false },
      });
    });
  });
});