import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from 'src/schemas/job.schema';

@Injectable()
export class MigrationService {
  constructor(@InjectModel(Job.name) private jobModel: Model<JobDocument>) {}

  async migrate() {
    try {
      console.log('Migration Started');
      const result = await this.jobModel.find();
      result.forEach(async (each) => {
        // await this.jobModel.findByIdAndUpdate(each._id, { date: new Date() });
        await this.jobModel.findByIdAndUpdate(each._id, {
          time: new Date(each.time),
        });
      });
      console.log('Migration successful');
    } catch (error) {
      console.log(error);
    }
  }
}
