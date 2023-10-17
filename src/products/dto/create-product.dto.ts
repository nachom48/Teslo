import { ApiProperty } from '@nestjs/swagger';
import {IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength} from 'class-validator'

export class CreateProductDto {


    @ApiProperty({
      description:'Product Title (unique)',
      nullable : false,
      minLength:1
    })
    @IsString()
    @MinLength(1)
    title2:string;


    @ApiProperty({
        description:'Product Title (unique)',
        nullable : false,
        minLength:1
      })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?:number;

    @ApiProperty({
        description:'Product Title (unique)',
        nullable : false,
        minLength:1
      })
    @IsString()
    @IsOptional()
    description?:string;

    @ApiProperty({
        description:'Product Title (unique)',
        nullable : false,
        minLength:1
      })
    @IsString()
    @IsOptional()
    slug?:string;

    @ApiProperty({
        description:'Product Title (unique)',
        nullable : false,
        minLength:1
      })
    @IsInt()
    @IsOptional()
    @IsPositive()
    stock?:number;

    @ApiProperty({
        description:'Product Title (unique)',
        nullable : false,
        minLength:1
      })
    @IsString({ each:true})
    @IsArray()
    sizes:string[];

    @ApiProperty({
        description:'Product Title (unique)',
        nullable : false,
        minLength:1
      })
    @IsString({ each:true})
    @IsArray()
    @IsOptional()
    tags:string[];

    @ApiProperty({
        description:'Product Title (unique)',
        nullable : false,
        minLength:1
      })
    @IsIn(['men','women','kid','unisex'])
    gender:string;


    @ApiProperty({
        description:'Product Title (unique)',
        nullable : false,
        minLength:1
      })
    @IsString({ each:true})
    @IsArray()
    @IsOptional()
    images?:string[];
}
