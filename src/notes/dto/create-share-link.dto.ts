import {IsInt, Max, Min} from "class-validator";

export class CreateShareLinkDto {
    @IsInt()
    @Min(5)
    @Max(1440)
    ttlMinutes: number;
}