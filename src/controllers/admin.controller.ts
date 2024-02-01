import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { authToUserDto, GetUsersParamDto } from 'src/dtos/admin.dto';
import { AuthService } from 'src/services/auth.service';
import { JobService } from 'src/services/job.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly authService: AuthService,
    private jobService: JobService,
  ) {}

  @Get('/users/:UserType')
  @ApiOperation({ operationId: 'adminFetchUsers' })
  async fetchUsers(@Param() params: GetUsersParamDto) {
    try {
      const result = await this.authService.findAll({
        userType: params.userType,
      });
      return {
        message: 'User fetched successfully',
        result: result.map((e) => authToUserDto(e)),
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get('/jobs')
  @ApiOperation({ operationId: 'adminFetchJobs' })
  async fetchJobs() {
    try {
      const result = await this.jobService.findAll();
      // return {
      //   message: 'Jobs fetched successfully',
      //   result: result.map((e) => jobToJobDto(e)),
      // };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
