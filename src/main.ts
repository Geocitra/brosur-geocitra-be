import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // [BARU] Mendaftarkan filter error global agar semua error diratakan menjadi format JSON baku
  app.useGlobalFilters(new GlobalExceptionFilter());

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