import { createParamDecorator } from "@nestjs/common";



export const GetRawHeader = createParamDecorator(
    (data,ctx)=>{
        const req = ctx.switchToHttp().getRequest();
        const rawHeader = req.rawHeaders
        return rawHeader;
    }
)