import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document, Query } from 'mongoose';
import { ERROR_MESSAGES } from 'src/constants/errorMessages';
import {
  Auth,
  AuthDocument,
  AuthOptional,
  AuthQuery,
} from 'src/schemas/auth.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private jwtService: JwtService,
  ) {}

  create(user: Auth): Promise<Auth> {
    return this.authModel.create(user);
  }

  findAll(user?: AuthOptional) {
    return this.authModel.find(user);
  }

  findOne(user?: AuthOptional): AuthQuery {
    return this.authModel.findOne(user);
  }

  findOneOrFail(user: AuthOptional): Promise<Auth> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.findOne(user);
        if (!result) {
          reject();
          return;
        }
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  register(user: Auth): Promise<Auth | boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const existUser = await this.findOne({ mobile: user.mobile });
        if (existUser && existUser.mobileVerified) {
          reject(ERROR_MESSAGES.USER_ALREADY_REGISTERED);
        } else if (existUser && !user.mobileVerified) {
          resolve(false);
        } else {
          const createdUser = await this.create(user);
          resolve(createdUser);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  updateByMobile(mobile: string, user: AuthOptional) {
    return this.authModel.updateOne({ mobile }, user, {
      new: true,
    });
  }

  markMobileAsVerified(mobile: string) {
    return this.updateByMobile(mobile, { mobileVerified: true });
  }

  createAuthToken(user: Omit<Auth, 'password'>): string {
    return this.jwtService.sign(JSON.parse(JSON.stringify(user)));
  }
}
