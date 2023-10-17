import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import {FileInterceptor} from '@nestjs/platform-express'
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files - Get and Upload')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService,
              private readonly configService: ConfigService) {}


  //aca devuelvo la imagen misma utilizando res.sendFile de express
  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName:string
  ){
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }   

  @Post('product')
  @UseInterceptors( FileInterceptor('file',{
    fileFilter:fileFilter,
    // limits:{fileSize:1000}
    storage:diskStorage({
      destination:'./static/products',
      filename:fileNamer,
    })
  } ))
  //en el interceptor pongo la llave, la key que le mando en el body de form-data
    uploadProductFile(@UploadedFile() file : Express.Multer.File){


      if(!file){
        throw new BadRequestException('Make sure that the file is an image')
      }

      const secureUrl = `${this.configService.get('HOSTAPI')}/files/product/${file.filename}`;

      return {secureUrl}


    }
}
