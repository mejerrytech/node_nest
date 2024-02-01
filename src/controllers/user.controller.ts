import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { authToUserDto } from 'src/dtos/admin.dto';
import { AuthService } from 'src/services/auth.service';

@Controller('user')
export class UserController {
  constructor(private readonly authService: AuthService) {}

  @Get(':userId')
  @ApiOperation({ operationId: 'getUser' })
  async fetchUsers(@Param() { userId }: { userId: string }) {
    try {
      if (!isUUID(userId)) {
        throw new Error('Not a valid user Id');
      }

      const result = await this.authService.findAll({
        id: userId,
      });
      return {
        message: 'User fetched successfully',
        result: result.map((e) => authToUserDto(e)),
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
