import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports:[
    AuthModule,
    TypeOrmModule.forFeature([Product,ProductImage])
  ],
  exports:[
    ProductsService,
    TypeOrmModule
  ]
})
export class ProductsModule {}


//en el typeorm.forFeature declaro las entidades que dependen de este modulo.
//Cualquier que iumporte el modulo de Produco va a tener acceso al srevicio Product Service