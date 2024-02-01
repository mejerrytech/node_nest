import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Auth, UserType } from 'src/schemas/auth.schema';
import { UserIdDto } from './common/common.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Helper } from 'src/utils/helper.util';

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  mobile: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  mobile: string;

  @ApiProperty()
  @IsIn(Object.values(UserType))
  userType: UserType;
}

export class VerifyOTPDto {
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  @ApiProperty()
  mobile: string;

  @IsNotEmpty()
  @ApiProperty()
  otp: string;

  @IsNotEmpty()
  @ApiProperty()
  tokenId: string;
}

export type AuthDto = Omit<RegisterDto, 'password'> & UserIdDto;

export function authToAuthDto(auth: Auth): AuthDto {
  return {
    userId: auth.id,
    email: auth.email,
    mobile: auth.mobile,
    name: auth.name,
    userType: auth.userType,
  };
}
