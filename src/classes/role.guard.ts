import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../interfaces/auth.interface';
import { UserType } from 'src/schemas/auth.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserType[]>('roles', context.getHandler());

    // TODO: Condition must be false on production
    if (!roles) {
      return false;
    }

    const request = context.switchToHttp().getRequest();

    const user: JwtPayload = request.user;

    return matchRoles(roles, user.userType);
  }
}

function matchRoles(roles: UserType[], UserType: UserType): boolean {
  console.log(UserType);
  return roles.includes(UserType);
}
