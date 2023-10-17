import { Product } from "../../products/entities/product.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        unique:true
    })
    email:string;

    @Column('text',{
        select:false
    })
    password:string;

    @Column('text')
    fullname:string;

    @Column('bool',{
        default:true
    })
    isActive:boolean;

    @Column('text', {
        array: true,
        default:['user']
        //todos los usuarios que cree van a tener por defecto el rol de user
    })
    roles:string[];

    @OneToMany(
        ()=>Product,
        ( product )=> product.user
    )
    product:Product;


    //eso para que todos los mails los guarde como minuscula y sine spacios 
    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.checkFieldsBeforeInsert();
    }
}
