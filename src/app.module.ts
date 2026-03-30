import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// Import Modul yang sudah dibuat
import { PrismaModule } from './prisma/prisma.module';
import { ShowcaseModule } from './modules/showcase/showcase.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // Konfigurasi Rate Limiting: Maksimal 60 request per 60.000 ms (1 Menit)
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60,
    }]),

    PrismaModule,
    ShowcaseModule,
    UploadModule,
  ],
  controllers: [],
  providers: [
    {
      // Mengaktifkan pelindung Throttler ke SEMUA endpoint secara global
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }