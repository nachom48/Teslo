import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";


export const GetUser = createParamDecorator(
    (data,ctx:ExecutionContext)=>{
        //la data es lo que mando en el parametro de GetUser('estaEsLaData')
        //el ctx es el contexto en el cual se ejecuta la funcion, y tenemos acceso a la request 
        const req = ctx.switchToHttp().getRequest();
        const user= req.user;

        if(!user) throw new InternalServerErrorException('User not found in request')



        return (!data)? user : user[data];
    }
)