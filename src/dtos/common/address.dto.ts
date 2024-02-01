import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Address } from 'src/schemas/common/address.schema';

export class LocationDto {
  @IsNumber({ maxDecimalPlaces: 15 })
  lat: number;
  @IsNumber({ maxDecimalPlaces: 15 })
  lng: number;
}

export class AddressDto {
  @IsString()
  @Length(10)
  address1: string;

  @IsString()
  address2: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  landmark: string;

  @IsNumber()
  pincode: number;

  @ValidateNested()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => LocationDto)
  coordinates: LocationDto;
}

export function addressDtoToAddress(address: AddressDto): Address {
  return {
    address1: address.address1,
    address2: address.address2,
    city: address.city,
    coordinates: {
      lat: address.coordinates.lat,
      lng: address.coordinates.lng,
    },
    landmark: address.landmark,
    pincode: address.pincode,
    state: address.state,
  };
}

export function addressToAddressDto(address: Address): AddressDto {
  return {
    address1: address.address1,
    address2: address.address2,
    city: address.city,
    coordinates: {
      lat: address.coordinates.lat,
      lng: address.coordinates.lng,
    },
    landmark: address.landmark,
    pincode: address.pincode,
    state: address.state,
  };
}
