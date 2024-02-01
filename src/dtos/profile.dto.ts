import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Profile } from 'src/schemas/profile.schema';
import { AddressDto, addressToAddressDto } from './common/address.dto';
import { UserIdDto } from './common/common.dto';

export class UpdateProfileParamsDto {
  @IsUUID()
  id: string;
}

export class ProfileUpdateDto {
  @IsDateString()
  dateOfBirth: string;

  // @IsBase64()  // TODO: Only commented for testing purposes
  @IsString()
  imageURL: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => AddressDto)
  @ValidateNested()
  homeAddress: AddressDto;

  @ValidateIf((o) => o.isWorkAddressSameAsHome === false)
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => AddressDto)
  @ValidateNested()
  workAddress?: AddressDto;

  @IsBoolean()
  isWorkAddressSameAsHome: boolean;

  @IsArray()
  tags: string[];
}

// export function profileDtoToProfile(
//   profile: ProfileUpdateDto,
//   userId: mongoose.Schema.Types.UUID,
//   UserType: UserType,
// ): Profile {
//   return {
//     imageURL: profile.imageURL,
//     dateOfBirth: new Date(profile.dateOfBirth),
//     tags: profile.tags,
//     homeAddress: addressDtoToAddress(profile.homeAddress),
//     workAddress: addressDtoToAddress(profile.workAddress),
//     userId,
//     UserType,
//   };
// }

export type ProfileDto = ProfileUpdateDto & UserIdDto;

export function profileToProfileDto(profile: Profile): ProfileDto {
  return {
    dateOfBirth: profile.dateOfBirth.toString(),
    homeAddress: addressToAddressDto(profile.homeAddress),
    imageURL: profile.imageURL,
    isWorkAddressSameAsHome: profile.isWorkAddressSameAsHome,
    tags: profile.tags,
    workAddress: profile.workAddress
      ? addressToAddressDto(profile.workAddress)
      : null,
    userId: profile.userId,
  };
}
