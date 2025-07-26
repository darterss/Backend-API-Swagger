import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { NotesModule } from '../notes/notes.module';

@Module({
  imports: [NotesModule],
  controllers: [PublicController],
})
export class PublicModule {}