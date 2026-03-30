"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.enableCors({
        origin: ['http://localhost:3005', 'http://localhost:3000'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    const port = process.env.PORT || 4005;
    await app.listen(port);
    console.log(`🚀 Showcase BE Engine berjalan di: http://localhost:${port}/api`);
    console.log(`🛡️  Resilience Layer (Rate Limiter & Exception Filter) AKTIF!`);
}
bootstrap();
//# sourceMappingURL=main.js.map