import { Body, Controller, Get, Param, Put, Request } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { MESSAGES } from 'src/constants/messages';
import { Auth } from 'src/decorators/auth.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { ProfileUpdateDto, profileToProfileDto } from 'src/dtos/profile.dto';
import { ResolvedRequest } from 'src/interfaces/http.interface';
import { UserType } from 'src/schemas/auth.schema';
import { ProfileService } from 'src/services/profile.service';

@Auth()
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}
  @Put()
  @ApiOperation({ operationId: 'updateProfile' })
  async updateProfile(
    @Body() profileBody: ProfileUpdateDto,
    @Request() request: ResolvedRequest,
  ) {
    const { userId, userType } = request.user;
    try {
      const result = await this.profileService.updateProfileByUserId(
        {
          ...profileBody,
          dateOfBirth: new Date(profileBody.dateOfBirth),
          userId,
          userType,
        },
        profileBody.isWorkAddressSameAsHome,
      );
      return { message: MESSAGES.PROFILE_UPDATED, result };
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get(':userId')
  @Roles([UserType.ADMIN])
  @ApiOperation({ operationId: 'getProfileByUserId' })
  getProfileForAdmin(@Param() { userId }: { userId: string }) {
    return this.fetchProfile(userId);
  }

  @Get()
  @Roles([UserType.FREELANCER, UserType.CLIENT])
  @ApiOperation({ operationId: 'getProfile' })
  async getProfile(@Request() request: ResolvedRequest) {
    const { userId } = request.user;
    return this.fetchProfile(userId);
  }

  async fetchProfile(userId: string) {
    try {
      if (!isUUID(userId)) {
        throw new Error('Not a valid user Id');
      }
      const result = await this.profileService.fetchProfile(userId);

      if (!result) {
        throw new Error('User not found!');
      }

      return {
        message: MESSAGES.PROFILE_FETCHED,
        result: result ? profileToProfileDto(result) : null,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
