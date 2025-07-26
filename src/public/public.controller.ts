import {Controller, Get, Param} from '@nestjs/common';
import {NotesService} from "../notes/notes.service";
import {ApiResponse} from "@nestjs/swagger";

@Controller('public')
export class PublicController {
    constructor(private notesService: NotesService) {}

    @Get('notes/:token')
    @ApiResponse({ status: 200, description: 'Note retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Share link not found' })
    @ApiResponse({ status: 410, description: 'Share link expired or used' })
    async getSharedNote(@Param('token') token: string) {
        return this.notesService.getNoteByToken(token);
    }
}
