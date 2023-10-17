import { IsOptional, IsPositive, Min } from "class-validator";
import { Type } from 'class-transformer'
import { ApiProperty } from "@nestjs/swagger";

export class PaginationDTO {

    @ApiProperty({
        default:10,description:'How many rows do you need?'
    })
    @IsOptional()
    @IsPositive()
    @Type(()=>Number) // tambien sep odria hacer con el enableImplicitConversions en el main.ts
    limit?:number;


    @ApiProperty({
        default:0,description:'How many rows do you want to skip?'
    })
    @IsOptional()
    @Min(0)
    @Type(()=>Number)
    offset?:number;
}


//Con El Type transformamos el string del URL en number 