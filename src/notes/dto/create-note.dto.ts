import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
    @ApiProperty({ example: 'My Note Title' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Note content goes here' })
    @IsString()
    @IsNotEmpty()
    body: string;
}