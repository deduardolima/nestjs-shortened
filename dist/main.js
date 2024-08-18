"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const app_module_1 = require("./app.module");
const tracing_1 = require("./tracing");
async function bootstrap() {
    tracing_1.default.start();
    console.log('Started OTEL SDK');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    app.enableShutdownHooks();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Encurtador de Urls Api')
        .setDescription('API para gerenciamento e controle de urls encurtadas')
        .setVersion('1.1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
    }, 'access-token')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), { fallbackOnErrors: true });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map