import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Job, JobDocument } from 'src/schemas/job.schema';

@Injectable()
export class JobService {
  constructor(@InjectModel(Job.name) private jobModel: Model<JobDocument>) {}

  create(jobData: Job) {
    return this.jobModel.create(jobData);
  }

  findAll(userId?: string) {
    if (userId) {
      return this.jobModel.find({ userId });
    }
    return this.jobModel.find();
  }
}
