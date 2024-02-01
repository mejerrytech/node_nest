import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { config } from 'src/constants/config';
import { ERROR_MESSAGES } from 'src/constants/errorMessages';
import {
  LoginDto,
  RegisterDto,
  VerifyOTPDto,
  authToAuthDto,
} from 'src/dtos/auth.dto';
import { AuthService } from 'src/services/auth.service';
import { Helper } from 'src/utils/helper.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ operationId: 'login' })
  async login(@Body() loginDto: LoginDto) {
    const { password, mobile } = loginDto;

    try {
      const user = await this.authService.findOneOrFail({ mobile });
      const result = await Helper.comparePassword(password, user.password);
      if (result) {
        const bearerToken = this.authService.createAuthToken(
          authToAuthDto(user),
        );
        return {
          bearerToken,
        };
      }

      throw new Error(ERROR_MESSAGES.WRONG_USERNAME_PASSWORD);
    } catch (error) {
      throw new Error(ERROR_MESSAGES.WRONG_USERNAME_PASSWORD);
    }
  }

  @Post('register')
  @ApiOperation({ operationId: 'register' })
  async register(@Body() registerDto: RegisterDto) {
    const { email, name, mobile, userType } = registerDto;

    let { password } = registerDto;
    try {
      password = await Helper.hashPassword(password);
      const result = await this.authService.register({
        email,
        name,
        password,
        mobile,
        userType,
      });
      if (typeof result === 'boolean') {
        const result =
          config.environment === 'prod'
            ? await Helper.sendOTP(mobile)
            : { serviceSid: Helper.uuid() };
        return { tokenId: result.serviceSid };
      }
      return;
    } catch (error) {
      throw error;
    }
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('verifyOTP')
  @ApiOperation({ operationId: 'verifyOtp' })
  async verifyOTP(@Body() verifyOtpDto: VerifyOTPDto) {
    const { otp, mobile, tokenId } = verifyOtpDto;
    try {
      // await Helper.verifyOTP(mobile, otp, tokenId);
      await this.authService.markMobileAsVerified(mobile);
      return;
    } catch (error) {
      throw error;
    }
  }
}
