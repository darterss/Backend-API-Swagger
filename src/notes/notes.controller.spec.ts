import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

const mockNotesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  createShareLink: jest.fn(),
  getShareLinks: jest.fn(),
  revokeShareLink: jest.fn(),
};

describe('NotesController', () => {
  let controller: NotesController;
  let service: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: mockNotesService,
        },
      ],
    }).compile();

    controller = module.get<NotesController>(NotesController);
    service = module.get<NotesService>(NotesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a note', async () => {
      const createNoteDto = { title: 'Test', body: 'Test body' };
      const req = { user: { userId: 'user-1' } };
      const mockNote = { id: '1', ...createNoteDto, userId: 'user-1' };

      mockNotesService.create.mockResolvedValue(mockNote);

      const result = await controller.create(req, createNoteDto);

      expect(result).toEqual(mockNote);
      expect(service.create).toHaveBeenCalledWith('user-1', createNoteDto);
    });
  });

  describe('findAll', () => {
    it('should return array of notes', async () => {
      const req = { user: { userId: 'user-1' } };
      const mockNotes = [{ id: '1', title: 'Test', body: 'Test body', userId: 'user-1' }];

      mockNotesService.findAll.mockResolvedValue(mockNotes);

      const result = await controller.findAll(req);

      expect(result).toEqual(mockNotes);
      expect(service.findAll).toHaveBeenCalledWith('user-1');
    });
  });
});