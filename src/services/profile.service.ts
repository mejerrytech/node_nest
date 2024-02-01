import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from 'src/schemas/profile.schema';
import { InjectConnection } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Address, AddressDocument } from 'src/schemas/common/address.schema';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    @InjectModel(Address.name) private addressModel: Model<AddressDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async updateProfileByUserId(
    profileData: Profile,
    isWorkAddressSameAsHome: boolean,
  ) {
    const transactionSession = await this.connection.startSession();

    return transactionSession.withTransaction(async (session) => {
      const homeAddress = await this.addressModel.create(
        [profileData.homeAddress],
        { session },
      );

      const workAddress = isWorkAddressSameAsHome
        ? homeAddress
        : await this.addressModel.create([profileData.workAddress], {
            session,
          });

      return this.profileModel
        .findOneAndUpdate(
          { userId: profileData.userId },
          {
            ...profileData,
            homeAddress: homeAddress[0]._id,
            workAddress: workAddress[0]._id,
          },
          {
            new: true,
            upsert: true,
          },
        )
        .session(session)
        .exec();
    });
  }

  fetchProfile(userId: string) {
    return this.profileModel
      .findOne({ userId })
      .populate(['homeAddress', 'workAddress']);
  }
}
