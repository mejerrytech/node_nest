import { compare, hash } from 'bcrypt';
import { config } from 'src/constants/config';
import { Twilio } from 'twilio';
import { v4 as uuidv4 } from 'uuid';

export class Helper {
  static async hashPassword(password: string) {
    const result = await hash(password, 10);
    return result;
  }

  static async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return compare(password, hash);
  }

  static async initOTPInstance() {
    const accountSid = config.twilio.sid;
    const authToken = config.twilio.authToken;
    const client = new Twilio(accountSid, authToken);
    return client;
  }

  static async sendOTP(mobile: string) {
    const client = await Helper.initOTPInstance();
    const { sid } = await client.verify.v2.services.create({
      friendlyName: 'verification code',
    });

    return client.verify.v2
      .services(sid)
      .verifications.create({ to: `+91${mobile}`, channel: 'sms' });
  }

  static verifyOTP(
    mobile: string,
    otp: string,
    tokenId: string,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const client = await Helper.initOTPInstance();
      return client.verify.v2
        .services(tokenId)
        .verificationChecks.create({
          code: otp,
          to: `+91${mobile}`,
        })
        .then((verification_check) => {
          verification_check.status === 'approved' ? resolve() : reject();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static uuid(): string {
    return uuidv4();
  }
}
