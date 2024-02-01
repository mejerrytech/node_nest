import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  console.log();
  const user = request.body.user;
});
