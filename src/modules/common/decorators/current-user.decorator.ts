import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TUser } from 'src/types';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as TUser;
  },
);
