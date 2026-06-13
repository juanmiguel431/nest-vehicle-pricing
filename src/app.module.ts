import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import session from 'express-session';
import { getEnvFileName } from './utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFileName()
    }),
    // TypeOrmModule.forRoot({
    //   type: 'better-sqlite3',
    //   database: 'db.sqlite',
    //   entities: [User, Report],
    //   synchronize: true
    // }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'better-sqlite3',
        database: configService.get<string>('DB_NAME'),
        entities: [User, Report],
        synchronize: true
      })
    }),
    UsersModule,
    AuthModule,
    ReportsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      })
    }
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: 'my-secret',
          resave: false,
          saveUninitialized: false
        })
      ).forRoutes('*');
  }
}
