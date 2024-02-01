import { Request } from '@nestjs/common';
import { UserType } from 'src/schemas/auth.schema';
import { JwtPayload } from './auth.interface';

export interface ResolvedRequest extends Request {
  user: JwtPayload;
}
