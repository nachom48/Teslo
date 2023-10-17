import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService,
    @InjectRepository( User )
    private readonly userRepository : Repository<User>
  ){}



 
  async runSeed(){
    await this.delateTables();
    const adminUser = await this.inserUsers()
    await this.insertNewProducts(adminUser)
    return 'SEED EXECUTED';

  }

  private async delateTables(){
    //con esto vamos a borrar tabla por tabla
    await this.productService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder
      .delete()
      .where({})
      .execute()

  }


  private async inserUsers(){

    const seedUsers = initialData.users;

    const users :User[] = [];

    seedUsers.forEach( user=>{
      users.push(this.userRepository.create(user))
    });

    const dbUsers = await this.userRepository.save(seedUsers);
    return dbUsers[0]
  }


  private async insertNewProducts( user:User){
    try {
      this.productService.deleteAllProducts();
      const products = initialData.products;

      const insertPromises = [];

      products.forEach(product=>{
        insertPromises.push(this.productService.create(product,user))
      });

      //Espera que todas las promesas se resuelvan y dsp continua
      const results = await Promise.all(insertPromises);
      //aca tendriamos el resultado de cada promesa, el id de cadap roducto creado con susd atos
      return true  
    } catch (error) {
      console.log("error",error)
    }
  }

}
