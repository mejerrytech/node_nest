import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MESSAGES } from 'src/constants/messages';
import {
  JobSearchQueryDto,
  jobSearchQueryToJobSearchResultDto,
} from 'src/dtos/search.dto';
import { SearchService } from 'src/services/search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}
  @Get()
  @ApiOperation({ operationId: 'searchJobs' })
  async searchJob(@Query() searchQuery: JobSearchQueryDto) {
    try {
      const result = await this.searchService.fetchJobs(searchQuery);
      return {
        message: MESSAGES.JOB_SEARCH,
        result: result.map((e) => jobSearchQueryToJobSearchResultDto(e)),
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
