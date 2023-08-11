import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ((process.env.NODE_ENV?.trim() === 'production') ? '.env' : '.env.dev'),
      isGlobal: true
    }),
    MongooseModule.forRoot(
      process.env.DB_URI,
      {
        dbName: process.env.DB_NAME
      }
    ),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private configService: ConfigService) { this.getEnv() }

  getEnv() {
    console.log("Enviornment Service: ", this.configService.get<string>('NODE_ENV'));
    console.log("Using enviornment File: ", (process.env.NODE_ENV?.trim() === 'production') ? '.env' : '.env.dev');
  }
}
