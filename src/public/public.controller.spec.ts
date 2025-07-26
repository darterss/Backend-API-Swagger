import { Test, TestingModule } from '@nestjs/testing';
import { PublicController } from './public.controller';
import { NotesService } from '../notes/notes.service';

const mockNotesService = {
  getNoteByToken: jest.fn(),
};

describe('PublicController', () => {
  let controller: PublicController;
  let service: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicController],
      providers: [
        {
          provide: NotesService,
          useValue: mockNotesService,
        },
      ],
    }).compile();

    controller = module.get<PublicController>(PublicController);
    service = module.get<NotesService>(NotesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSharedNote', () => {
    it('should return shared note', async () => {
      const token = 'test-token';
      const mockNote = {
        id: '1',
        title: 'Shared Note',
        body: 'Shared content',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockNotesService.getNoteByToken.mockResolvedValue(mockNote);

      const result = await controller.getSharedNote(token);

      expect(result).toEqual(mockNote);
      expect(service.getNoteByToken).toHaveBeenCalledWith(token);
    });
  });
});