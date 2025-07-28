import {ForbiddenException, GoneException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateNoteDto} from "./dto/create-note.dto";
import {UpdateNoteDto} from "./dto/update-note.dto";
import {CreateShareLinkDto} from "./dto/create-share-link.dto";
import { randomUUID, createHash } from 'crypto';
import {INote, IShareLinkResponse} from "./notes.types";

@Injectable()
export class NotesService {
    constructor(private prisma: PrismaService) {
    }

    async create(userId: string, createNoteDto: CreateNoteDto): Promise<INote> {
        return this.prisma.note.create({
            data: {
                ...createNoteDto,
                userId,
            },
        });
    }

    async findAll(userId: string): Promise<INote[]> {
        return this.prisma.note.findMany({
            where: {userId},
            orderBy: {createdAt: 'desc'},
        });
    }

    async findOne(id: string, userId: string): Promise<INote> {
        const note = await this.prisma.note.findUnique({
            where: { id },
        });

        if (!note) {
            throw new NotFoundException('Note not found');
        }

        if (note.userId !== userId) {
            throw new ForbiddenException('You do not have permission to access this note');
        }

        return note;
    }

    async update(id: string, userId: string, updateNoteDto: UpdateNoteDto) {
        await this.findOne(id, userId); // checking acces rights

        return this.prisma.note.update({
            where: {id},
            data: updateNoteDto,
        });
    }

    async remove(id: string, userId: string) {
        await this.findOne(id, userId); // checking acces rights

        return this.prisma.note.delete({
            where: {id},
        });
    }


    async createShareLink(noteId: string, userId: string, dto: CreateShareLinkDto): Promise<IShareLinkResponse> {
        await this.findOne(noteId, userId); // checking access rights

        // uniq token generated
        const token = randomUUID();
        const tokenHash = createHash('sha256').update(token).digest('hex');

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + dto.ttlMinutes);

        const shareLink = await this.prisma.shareLink.create({
            data: {
                noteId,
                tokenHash,
                expiresAt,
            },
        });

        return {
            id: shareLink.id,
            token, // return origin token one time
            expiresAt: shareLink.expiresAt,
            url: `/public/notes/${token}`,
        };
    }

    async getShareLinks(noteId: string, userId: string) {
        await this.findOne(noteId, userId); // checking access rights

        return this.prisma.shareLink.findMany({
            where: {noteId},
            select: {
                id: true,
                expiresAt: true,
                usedAt: true,
                isActive: true,
                createdAt: true,
            },
            orderBy: {createdAt: 'desc'},
        });
    }

    async revokeShareLink(noteId: string, tokenId: string, userId: string) {
        await this.findOne(noteId, userId); // checking access rights

        const shareLink = await this.prisma.shareLink.findFirst({
            where: {id: tokenId, noteId},
        });

        if (!shareLink) {
            throw new NotFoundException('Share link not found');
        }

        return this.prisma.shareLink.update({
            where: {id: tokenId},
            data: {isActive: false},
        });
    }

    async getNoteByToken(token: string): Promise<INote> {
        const tokenHash = createHash('sha256').update(token).digest('hex');

        const shareLink = await this.prisma.shareLink.findUnique({
            where: {tokenHash},
            include: {note: true},
        });

        if (!shareLink) {
            throw new NotFoundException('Share link not found');
        }

        if (!shareLink.isActive || shareLink.usedAt) {
            throw new GoneException('Share link has been used or revoked');
        }

        if (shareLink.expiresAt < new Date()) {
            throw new GoneException('Share link has expired');
        }

        // Marking the link as used
        await this.prisma.shareLink.update({
            where: {id: shareLink.id},
            data: {usedAt: new Date()},
        });

        return shareLink.note;
    }
}