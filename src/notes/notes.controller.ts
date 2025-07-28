import {Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiResponse} from '@nestjs/swagger';
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
    @ApiResponse({ status: 201, description: 'Note wrote successfully' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    create(@Req() req, @Body() createNoteDto: CreateNoteDto) {
        return this.notesService.create(req.user.userId, createNoteDto);
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Get notes successfully' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    findAll(@Req() req) {
        return this.notesService.findAll(req.user.userId);
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Get note successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden. Note belongs to another user' })
    @ApiResponse({ status: 404, description: 'Note not found' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    findOne(@Param('id') id: string, @Req() req) {
        return this.notesService.findOne(id, req.user.userId);
    }

    @Put(':id')
    @ApiResponse({ status: 200, description: 'Edit note successfully' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiResponse({ status: 403, description: 'Forbidden. Note belongs to another user' })
    @ApiResponse({ status: 404, description: 'Note not found' })
    update(@Param('id') id: string, @Req() req, @Body() updateNoteDto: UpdateNoteDto) {
        return this.notesService.update(id, req.user.userId, updateNoteDto);
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Delete note successfully' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiResponse({ status: 403, description: 'Forbidden. Note belongs to another user' })
    @ApiResponse({ status: 404, description: 'Note not found' })
    remove(@Param('id') id: string, @Req() req) {
        return this.notesService.remove(id, req.user.userId);
    }

    // Share Links endpoints
    @Post(':id/share')
    @ApiResponse({ status: 201, description: 'Successfully' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiResponse({ status: 403, description: 'Forbidden. Note belongs to another user' })
    @ApiResponse({ status: 404, description: 'Note not found' })
    createShareLink(@Param('id') id: string, @Req() req, @Body() dto: CreateShareLinkDto) {
        return this.notesService.createShareLink(id, req.user.userId, dto);
    }

    @Get(':id/share')
    @ApiResponse({ status: 200, description: 'Successfully' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiResponse({ status: 403, description: 'Forbidden. Note belongs to another user' })
    @ApiResponse({ status: 404, description: 'Note not found' })
    getShareLinks(@Param('id') id: string, @Req() req) {
        return this.notesService.getShareLinks(id, req.user.userId);
    }

    @Delete(':id/share/:tokenId')
    @ApiResponse({ status: 200, description: 'Successfully' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiResponse({ status: 403, description: 'Forbidden. It belongs to another user' })
    @ApiResponse({ status: 404, description: 'Not found' })
    revokeShareLink(@Param('id') id: string, @Param('tokenId') tokenId: string, @Req() req) {
        return this.notesService.revokeShareLink(id, tokenId, req.user.userId);
    }
}
