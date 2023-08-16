import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RouteInteractionMiddleware } from './middlewares/RouteInteraction.middleware';


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
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RouteInteractionMiddleware)
      .forRoutes('auth'); // Update with the appropriate controller path
  }
  constructor(private configService: ConfigService) { this.getEnv() }

  getEnv() {
    console.log("Enviornment Service: ", this.configService.get<string>('NODE_ENV'));
    console.log("Using enviornment File: ", (process.env.NODE_ENV?.trim() === 'production') ? '.env' : '.env.dev');
  }
}
