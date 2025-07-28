import {IsInt, Max, Min} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateShareLinkDto {
    @ApiProperty({ example: 1000 })
    @IsInt()
    @Min(5)
    @Max(1440)
    ttlMinutes: number;
}