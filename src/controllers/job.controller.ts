import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MESSAGES } from 'src/constants/messages';
import { Auth } from 'src/decorators/auth.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { JobDto, jobDtoToJob } from 'src/dtos/job.dto';
import { ResolvedRequest } from 'src/interfaces/http.interface';
import { UserType } from 'src/schemas/auth.schema';
import { JobService } from 'src/services/job.service';

@Auth()
@Controller('job')
export class JobController {
  constructor(private jobService: JobService) {}
  @Post()
  @Roles([UserType.CLIENT])
  @ApiOperation({ operationId: 'createJob' })
  async create(@Body() jobData: JobDto, @Request() request: ResolvedRequest) {
    const { userId } = request.user;
    try {
      await this.jobService.create(jobDtoToJob(jobData, userId));
      return {
        message: MESSAGES.JOB_CREATE,
      };
    } catch (error) {
      new Error(error);
    }
  }

  @Get()
  @Roles([UserType.CLIENT])
  @ApiOperation({ operationId: 'getJobs' })
  async fetch(@Request() request: ResolvedRequest) {
    const { userId } = request.user;
    try {
      const result = await this.jobService.findAll(userId);
      return {
        message: MESSAGES.JOB_FETCH,
        result,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
