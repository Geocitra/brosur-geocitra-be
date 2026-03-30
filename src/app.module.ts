import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// Import Modul yang baru dibuat
import { PrismaModule } from './prisma/prisma.module';
import { ShowcaseModule } from './modules/showcase/showcase.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'), // [PENTING] Menyesuaikan path dari folder dist
      serveRoot: '/uploads',
    }),
    PrismaModule,
    ShowcaseModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }