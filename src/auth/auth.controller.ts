import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { GetRawHeader } from './decorators/get-rawHeaders.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
    loginUser(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user:User 
    ) {

  return this.authService.checkAuthStatus(user)
}

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user : User,
    @GetUser('email') userEmail:string,
    @GetRawHeader() rawHeader: string[]
  ){
    return rawHeader;
  }


  // @SetMetadata('roles',['admin','super-user'])

  @Get('private2')
  @RoleProtected( ValidRoles.superUser,ValidRoles.admin )
  @UseGuards(AuthGuard(),UserRoleGuard)
  privateRoute2(
    @GetUser() user : User,
  ){
    return {
      ok:true,
      user
    }
  }

  @Get('private3')
  @Auth(ValidRoles.superUser)
  privateRoute3(
    @GetUser() user : User,
  ){
    return {
      ok:true,
      user
    }
  }

  
 
}
