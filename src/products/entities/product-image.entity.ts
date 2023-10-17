import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";


@Entity({name:'product_images'})
export class ProductImage {

    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url:string;

    @ManyToOne(
        ()=>Product,
        (product)=> product.images,
        //si borro el prodcuto,quiero que estas imagenes se borren en cascada
        { onDelete :'CASCADE'}
    )
    product:Product
}

//Leaving generatedColumn will increment the number within the id