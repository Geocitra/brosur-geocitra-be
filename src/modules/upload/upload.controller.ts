import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {
    @Post('brochure')
    @UseInterceptors(
        FileInterceptor('file', {
            // Logic penyimpanan file di server lokal
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    cb(null, `brochure-${uniqueSuffix}${ext}`); // Output: brochure-163...123.pdf
                },
            }),
            // Logic proteksi file (Hanya izinkan PDF dan Gambar)
            fileFilter: (req, file, cb) => {
                if (file.mimetype === 'application/pdf' || file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    cb(null, true);
                } else {
                    cb(new BadRequestException('Hanya format PDF, JPG, dan PNG yang diperbolehkan!'), false);
                }
            },
            limits: { fileSize: 20 * 1024 * 1024 }, // Limit maksimal 20MB
        }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File tidak ditemukan dalam request.');
        }

        // Kembalikan URL yang bisa diakses langsung oleh Frontend
        return {
            message: 'File berhasil diunggah',
            fileUrl: `/uploads/${file.filename}`,
        };
    }
}