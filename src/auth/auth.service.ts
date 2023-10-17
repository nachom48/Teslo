import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository : Repository<User>,

    private readonly jwtService : JwtService
  ){ }


  async create(createUserDto: CreateUserDto) {
    try {
      const {password,...userData} = createUserDto;

      //con este lo croe
      const user = this.userRepository.create({
        ...userData,
        password:bcrypt.hashSync(password,10)
      });
      //con este lo guardo
      await this.userRepository.save(user)
      
      delete user.password;

      return {
        ...user,
      token:this.getJwtToken({id:user.id})}
    

      //teno q devoler el JWT de acceso xq lo autentico 
    } catch (error) {
      this.handleDbErrors(error)
    }

  }

  async login (loginDto:LoginDto){

    const {password,email} = loginDto;
    
    //eso es para solo recibir esa informacion de esa query
    const user = await this.userRepository.findOne({
      where:{email},
      select:{email:true, password:true,id:true}})

      if(!user) throw new UnauthorizedException('Credentials are not valid (email)')

      //con este bcript comapreSync hago la comparacion de que si tiene el mismo password encriptado

      if(!bcrypt.compareSync(password,user.password)) throw new UnauthorizedException('Credentials are not valid (password)')

            //teno q devoler el JWT de acceso xq lo autentico 

    return {
      ...user,
    token:this.getJwtToken({id:user.id})}

  }

  async checkAuthStatus(user:User){
      
    return {
      ...user,
      token:this.getJwtToken({id:user.id})
    }
  }

  private getJwtToken ( payload : JwtPayload) {

    const token = this.jwtService.sign(payload);
    return token;

  }


  private handleDbErrors(error:any): never {
    if (error.code==='23505') throw new BadRequestException(error.detail);
    console.log(error)

    throw new InternalServerErrorException('Please check server logs')
  }


}
