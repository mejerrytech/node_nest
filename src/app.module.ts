import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './classes/auth.guard';
import { config } from './constants/config';
import { AuthController } from './controllers/auth.controller';
import { ProfileController } from './controllers/profile.controller';
import { ExceptionsFilter } from './middlewares/exception-filter';
import { Auth, AuthSchema } from './schemas/auth.schema';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { AuthService } from './services/auth.service';
import { ProfileService } from './services/profile.service';
import { JobService } from './services/job.service';
import { JobController } from './controllers/job.controller';
import { Job, JobSchema } from './schemas/job.schema';
import { SearchController } from './controllers/search.controller';
import { SearchService } from './services/search.service';
import { MigrationService } from './services/migration.service';
import { AdminController } from './controllers/admin.controller';
import { Address, AddressSchema } from './schemas/common/address.schema';
import { UserController } from './controllers/user.controller';

const schemaImports: ModelDefinition[] = [
  { name: Auth.name, schema: AuthSchema },
  { name: Profile.name, schema: ProfileSchema },
  { name: Job.name, schema: JobSchema },
  { name: Address.name, schema: AddressSchema },
];

console.log(Address.name);

const controllers = [
  AppController,
  AuthController,
  ProfileController,
  JobController,
  SearchController,
  AdminController,
  UserController,
];

const services = [
  AppService,
  AuthService,
  ProfileService,
  JobService,
  SearchService,
  MigrationService,
];

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://mongo:mongo@localhost:27017/freelancer-client?authMechanism=DEFAULT&authSource=freelancer-client&directConnection=true',
      // 'mongodb+srv://nine-pay:ninepay%409tab.in@cluster0.34qgi.mongodb.net/freelancer-client',
    ),
    MongooseModule.forFeature(schemaImports),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: config.jwtSecretKey,
      signOptions: { expiresIn: '999999999h' },
    }),
  ],
  controllers: [...controllers],
  providers: [
    ...services,
    AuthGuard,
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
  ],
})
export class AppModule {
  constructor(private migrationService: MigrationService) {
    if (config.migrationRequired) {
      this.migrationService.migrate();
    }
  }
}
