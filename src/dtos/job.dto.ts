import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsMongoId,
  IsNumber,
  IsString,
} from 'class-validator';
import * as moment from 'moment';
import mongoose from 'mongoose';
import { Job } from 'src/schemas/job.schema';
import { UserIdDto } from './common/common.dto';

export class JobDto {
  @IsString()
  title: string;

  @IsDateString()
  date: string;

  @IsMilitaryTime()
  time: string;

  @IsNumber()
  duration: number;

  @IsArray()
  attachment: string[];

  @IsArray()
  @ArrayMinSize(1)
  tags: string[];

  @IsString()
  description: string;

  @IsMongoId()
  address: mongoose.Types.ObjectId;
}

export class CreateJobDto extends UserIdDto {}

export function jobDtoToJob(job: JobDto, userId: string): Job {
  return {
    title: job.title,
    description: job.description,
    attachment: job.attachment,
    date: new Date(job.date),
    time: moment(job.time, 'HH:mm').utc(true).toDate(),
    duration: job.duration,
    tags: job.tags,
    userId,
    address: job.address,
  };
}

// export function jobToJobDto(job: Job): CreateJobDto {
//   return {
//     title: job.title,
//     description: job.description,
//     attachment: job.attachment,
//     date: job.date as any,
//     time: moment(job.time, 'HH:mm').format('HH:mm'),
//     duration: job.duration,
//     tags: job.tags,
//     userId: job.userId,
//   };
// }
