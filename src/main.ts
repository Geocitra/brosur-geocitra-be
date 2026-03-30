import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Global Prefix (Krusial agar semua endpoint otomatis diawali /api)
  app.setGlobalPrefix('api');

  // 2. Konfigurasi CORS (Jos Gandos untuk akses lokal dari Next.js)
  app.enableCors({
    origin: ['http://localhost:3005', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 3. Jalankan server di Port 4005 (Sesuai rancangan blueprint)
  const port = process.env.PORT || 4005;
  await app.listen(port);

  console.log(`🚀 Showcase BE Engine berjalan di: http://localhost:${port}/api`);
  console.log(`📂 Folder Uploads tersedia di: http://localhost:${port}/uploads`);
}
bootstrap();