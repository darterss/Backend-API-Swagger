import {Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {NotesService} from "./notes.service";
import {CreateNoteDto} from "./dto/create-note.dto";
import {UpdateNoteDto} from "./dto/update-note.dto";
import {CreateShareLinkDto} from "./dto/create-share-link.dto";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";

@Controller('notes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotesController {
    constructor(private notesService: NotesService) {}

    @Post()
    create(@Req() req, @Body() createNoteDto: CreateNoteDto) {
        return this.notesService.create(req.user.userId, createNoteDto);
    }

    @Get()
    findAll(@Req() req) {
        return this.notesService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req) {
        return this.notesService.findOne(id, req.user.userId);
    }

    @Put(':id')
    update(@Param('id') id: string, @Req() req, @Body() updateNoteDto: UpdateNoteDto) {
        return this.notesService.update(id, req.user.userId, updateNoteDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req) {
        return this.notesService.remove(id, req.user.userId);
    }

    // Share Links endpoints
    @Post(':id/share')
    createShareLink(@Param('id') id: string, @Req() req, @Body() dto: CreateShareLinkDto) {
        return this.notesService.createShareLink(id, req.user.userId, dto);
    }

    @Get(':id/share')
    getShareLinks(@Param('id') id: string, @Req() req) {
        return this.notesService.getShareLinks(id, req.user.userId);
    }

    @Delete(':id/share/:tokenId')
    revokeShareLink(@Param('id') id: string, @Param('tokenId') tokenId: string, @Req() req) {
        return this.notesService.revokeShareLink(id, tokenId, req.user.userId);
    }
}
