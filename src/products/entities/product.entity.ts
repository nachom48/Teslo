    
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";


@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: 'cduanduand-2312321-dans-siadjaidja',
        description:'Product ID',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'TShirt Teslo',
        description:'Product Title',
        uniqueItems:true
    })
    @Column('text', {
        unique: true,
    })
    title2: string;

    @ApiProperty({
        example: '0',
        description:'Product Price',
    })
    @ApiProperty()
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'loremipsum',
        description:'Product Description',
        default:null
    })
    @ApiProperty()
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 't_shirt_teslo',
        description:'Product Slug - for Seo',
        uniqueItems:true

    })
    @ApiProperty()
    @Column('text', {
        unique: true
    })
    slug: string;


    @ApiProperty({
        example: 10,
        description:'Product Stock',
        default:0,
        uniqueItems:true
    })
    @ApiProperty()
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['M','S'],
        description:'Product Sizes',
    })
    @ApiProperty()
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example:'women',
        description:'Product Gender',
    })
    @ApiProperty()
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {
            cascade: true,
            eager: true
        }
        //el eager cada vez que busquemos con un metodo find me va a traer las imagenes 
    )
    images?: ProductImage[];

    //primero marco como se relaciona con la otra tabla
    // y dsp marco como se relaciona una instancia con las instancias de la otra tabla
    //el eager es para ver esa parte de la informacion
    //cuando hago una peticion para ver un producto
    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User


    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title2
        }
        this.slug = this.slug.toLowerCase().replaceAll("'", '').replaceAll(' ', '_')
    }


    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug.toLowerCase().replaceAll("'", '').replaceAll(' ', '_')
    }




}

