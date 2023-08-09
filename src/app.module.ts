import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ((process.env.NODE_ENV?.trim() === 'production') ? '.env' : '.env.dev'),
      isGlobal: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private configService: ConfigService) { this.getEnv() }

  getEnv() {
    console.log("Env Variable: ", process.env.NODE_ENV);
    console.log("Config Service: ", this.configService.get<string>('NODE_ENV'));
    console.log("Using enviornment File: ", (process.env.NODE_ENV?.trim() === 'production') ? '.env' : '.env.dev')
  }
}
