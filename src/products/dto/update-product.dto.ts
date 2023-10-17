import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}


//esto expande las configuraciones que tiene el CreateProductDto y las hace opcionales