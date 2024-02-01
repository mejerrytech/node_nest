import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { Model, PipelineStage } from 'mongoose';
import { JobSearchOptional, JobSearchQueryDto } from 'src/dtos/search.dto';
import { Address, AddressDocument } from 'src/schemas/common/address.schema';
import { Job, JobDocument, JobSearch } from 'src/schemas/job.schema';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel(Address.name) private addressModel: Model<AddressDocument>,
  ) {}

  fetchJobs(jobSearchOptional: JobSearchOptional): Promise<JobSearch[]> {
    return new Promise((resolve, reject) => {
      jobSearchOptional = plainToClass(JobSearchQueryDto, jobSearchOptional);
      let pincodeQuery = {};
      let tagQuery = {};

      if (jobSearchOptional.resolveTags().length) {
        tagQuery = {
          tags: { $in: jobSearchOptional.resolveTags() },
        };
      }

      if (jobSearchOptional.pincode) {
        pincodeQuery = {
          'address.pincode': Number(jobSearchOptional.pincode),
        };
      }

      const query: PipelineStage[] = [
        {
          $match: {
            isActive: true,
            isDelete: false,
            time: { $gt: new Date() },
            $or: [
              {
                $text: { $search: jobSearchOptional.text },
              },
              {
                ...pincodeQuery,
                ...tagQuery,
              },
            ],
          },
        },
        {
          $group: {
            _id: null,
            // count: { $count: {} },
            result: { $push: '$$ROOT' },
          },
        },
      ];

      this.jobModel
        .aggregate(query)
        .then(async (result) => {
          await this.addressModel.populate(result[0].result, {
            path: 'address',
          });
          resolve(result[0].result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
