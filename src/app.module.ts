import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { redisStore } from "cache-manager-redis-store";
import { OpenTelemetryModule } from 'nestjs-otel';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './error/global.exception';
import { PrismaModule } from './prisma/prisma.module';
import { UrlsModule } from './urls/urls.module';
import { UsersModule } from './users/users.module';

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    hostMetrics: true,
    apiMetrics: {
      enable: true,
    },
  },
});

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OpenTelemetryModuleConfig,
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get('REDIS_HOST'),
            port: +configService.get('REDIS_PORT'),
          },
        });
        return {
          store: {
            create: () => store as unknown as CacheStore,
          },
          ttl: 60 * 60 * 24,
        };
      },
    }),
    AuthModule,
    UsersModule,
    UrlsModule,
    PrismaModule

  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },

  ],
})
export class AppModule { }
