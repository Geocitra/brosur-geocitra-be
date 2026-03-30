import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ShowcaseService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Endpoint murni Read-Only (Hanya GET). 
     * Operasi Write sudah didelegasikan sepenuhnya ke Sync Engine (seed.ts).
     */
    async getShowcaseBySlug(slug: string) {
        const showcase = await this.prisma.productShowcase.findUnique({
            where: { slug },
            // [OPTIMASI ANALIS] 
            // Hanya kirim field yang akan dirender oleh Block Factory di Frontend.
            // Buang field 'id', 'createdAt', dan 'updatedAt' untuk mengecilkan ukuran JSON Payload.
            select: {
                slug: true,
                name: true,
                tagline: true,
                primaryColor: true,
                blocks: true,
            }
        });

        if (!showcase) {
            throw new NotFoundException(`Brosur untuk aplikasi dengan slug '${slug}' tidak ditemukan.`);
        }

        return showcase;
    }
}