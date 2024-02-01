import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/schemas/auth.schema';

export const Roles = (roles: UserType[]) => SetMetadata('roles', roles);
