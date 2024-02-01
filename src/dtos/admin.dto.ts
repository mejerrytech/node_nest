import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { Auth, UserType } from 'src/schemas/auth.schema';

export class GetUsersParamDto {
  @ApiProperty()
  @IsString()
  @IsIn([UserType.CLIENT, UserType.FREELANCER, UserType.ADMIN])
  userType: UserType;
}

export type UserDto = Omit<Auth, 'password'>;

export function authToUserDto(user: Auth): UserDto {
  return {
    email: user.email,
    mobile: user.mobile,
    name: user.name,
    userType: user.userType,
    id: user.id,
    emailVerified: user.emailVerified,
    isActive: user.isActive,
    isDelete: user.isDelete,
    mobileVerified: user.mobileVerified,
  };
}
