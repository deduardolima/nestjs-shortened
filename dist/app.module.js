"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const cache_manager_redis_store_1 = require("cache-manager-redis-store");
const nestjs_otel_1 = require("nestjs-otel");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const global_exception_1 = require("./error/global.exception");
const prisma_module_1 = require("./prisma/prisma.module");
const urls_module_1 = require("./urls/urls.module");
const users_module_1 = require("./users/users.module");
const OpenTelemetryModuleConfig = nestjs_otel_1.OpenTelemetryModule.forRoot({
    metrics: {
        hostMetrics: true,
        apiMetrics: {
            enable: true,
        },
    },
});
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            OpenTelemetryModuleConfig,
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    const store = await (0, cache_manager_redis_store_1.redisStore)({
                        socket: {
                            host: configService.get('REDIS_HOST'),
                            port: +configService.get('REDIS_PORT'),
                        },
                    });
                    return {
                        store: {
                            create: () => store,
                        },
                        ttl: 60 * 60 * 24,
                    };
                },
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            urls_module_1.UrlsModule,
            prisma_module_1.PrismaModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_FILTER,
                useClass: global_exception_1.AllExceptionsFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map