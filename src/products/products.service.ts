import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDTO } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid'
import { ProductImage } from './entities/product-image.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource
    //el DataScource sabe q configuracion deb ase de datos tengo y todo 

    // private readonly logger = new Logger('ProductsService')
  ) { }

  async create(createProductDto: CreateProductDto,user:User) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      //aqui es el operador Rest xq es el resto, saco las iamgenes y lo que me queda
      const product = this.productRepository.create({
        ...productDetails,
        //aqui es spread
        images: images.map(image => this.productImageRepository.create({ url: image })),
        user
        //TypeOrm va a inferir pro mi que este productoImages es de este producto
      });

      await this.productRepository.save(product);
      //Este save va a guardar ambas cosas

      return { ...product, images };
      //de esta manera,regreso solo las imagenes y no con el URL 
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDTO: PaginationDTO) {
    const { limit = 10, offset = 0 } = paginationDTO
    //de esta manera siempre tenog un valor en el limite y en el offset,s ilos mandan, usalos,y si no,usa esos
    const products: Product[] = await this.productRepository.find({
      take: limit,
      //toma , los que diga el limit
      skip: offset,
      relations: {
        images: true
      }
      //saltate, los q diga mi offset, off Set en 0 empieza desde el primero 
    });
    return products.map(({ images, ...rest }) => ({
      ...rest,
      images: images.map(img => img.url)
    }))

  }

  async findOne(term: string) {
    let producto: Product;
    if (isUUID(term)) {
      producto = await this.productRepository.findOneBy({ id: term })
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      producto = await queryBuilder
        .where(`UPPER(title2) =:title2 or slug =:slug`, {
          title2: term.toUpperCase(),
          slug: term.toLowerCase()
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne()

      //  producto = await this.productRepository.findOneBy({slug:term})
    }
    if (!producto) {
      throw new NotFoundException(`El producto con el termino : ${term} no fue encontrado`)
    }
    return producto;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map(image => image.url)
    }

  }

  async update(id: string, updateProductDto: UpdateProductDto,user:User) {

    const { images, ...toUpdate } = updateProductDto;
    //el toUpdate es lo que va a actualizar sin las imagenes 

    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    })

    if (!product) {
      throw new NotFoundException(`Product with id : ${id} not founda `)
    }

    //Create Query Runner
    //es una transaccion hasta ue explicitamente le digo que se ejecute no se guarda en la base ded atos pero hasta entonces puede actualizar, eliminar o crear distintas cosas en bases de datos
    //hasta que le hacemos el commit, si nunca llamamos nunca se hace y queda hasta que se pierda la conexion
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    //iniciar la transaccion, Todo lo que hagamos luego, va a estar añadiendolo en esa transaccion que inicamos
    await queryRunner.startTransaction();
    try {
      if (images) {
        //voy a borrar todas las imagenes cuya columna de productId con us relacion tengan el productId
        await queryRunner.manager.delete(ProductImage, { product: { id: id } });
        product.images = images.map(image => this.productImageRepository.create({ url: image }));
      } else {

      }

      product.user = user;
      //todavia no impacta en la base de datos
      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOnePlain(id)
    } catch (error) {
      //si falla le hagoe l rollback y libero la transaccion
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleExceptions(error)
    }

    //vamos a definir una serie de procedimientos, no va a impactar los commits hasta que ejecutemos todo, nos e va a guardar hasta terminar todo, 


    //aca led igo, buscate un producto por el ID y cargate todas las propiedades que tengan en el updateProductDto,no actualzia, lo prepara para la actualizacion
  }

  async remove(id: string) {
    const product = await this.findOne(id.toString())
    if (product) {
      this.productRepository.remove(product);
    }
  }

  private handleExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    // this.logger.error(error);
    // throw new InternalServerErrorException('Unexpected Error, check logs')
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      //Para borrar toda la semilla y todos los productos.
      return await query
        .delete()
        .where({})
        .execute();
    }
    catch (error) {
      this.handleExceptions(error)
    }
  }
}
