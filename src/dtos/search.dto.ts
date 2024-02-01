import { AddressDto, addressToAddressDto } from './common/address.dto';
import { JobDto } from './job.dto';
import {
  IsDateString,
  IsMilitaryTime,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import * as moment from 'moment';
import { JobSearch } from 'src/schemas/job.schema';

export class JobSearchQueryDto {
  @IsString()
  @MinLength(2)
  text: string;

  @IsOptional()
  @IsString()
  tags?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsMilitaryTime()
  time?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsOptional()
  @IsString()
  lat?: string;

  @IsOptional()
  @IsString()
  lng?: string;

  @IsOptional()
  @IsString()
  pincode?: string;

  resolveTags() {
    if (this.tags) {
      return this.tags.split(',');
    }
    return [];
  }
}
export type JobSearchOptional = JobSearchQueryDto;

export type JobSearchResultDto = Omit<JobDto, 'address'> & {
  address: AddressDto;
  id: string;
};

export function jobSearchQueryToJobSearchResultDto(
  jobSearchData: JobSearch,
): JobSearchResultDto {
  return {
    id: jobSearchData.id,
    description: jobSearchData.description,
    attachment: jobSearchData.attachment,
    date: moment(jobSearchData.date).utc(true).format('YYYY-MM-DD'),
    tags: jobSearchData.tags,
    time: moment(jobSearchData.time).utc().format('HH:mm'),
    duration: jobSearchData.duration,
    title: jobSearchData.title,
    address: addressToAddressDto(jobSearchData.address),
  };
}
