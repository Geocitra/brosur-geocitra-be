import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ShowcaseService {
    constructor(private readonly prisma: PrismaService) { }

    // [BARU] Endpoint untuk halaman utama Katalog (Bento Grid)
    async getAllShowcases() {
        return this.prisma.productShowcase.findMany({
            // Hanya tarik data esensial untuk Card, tinggalkan 'blocks' yang berat
            select: {
                slug: true,
                name: true,
                tagline: true,
                primaryColor: true,
            },
            // Urutkan berdasarkan yang paling awal dibuat (E-Daily akan jadi yang pertama/unggulan)
            orderBy: {
                createdAt: 'asc',
            },
        });
    }

    // Endpoint lama untuk detail brosur
    async getShowcaseBySlug(slug: string) {
        const showcase = await this.prisma.productShowcase.findUnique({
            where: { slug },
            select: {
                slug: true,
                name: true,
                tagline: true,
                primaryColor: true,
                blocks: true, // Hanya ini yang butuh blocks
            }
        });

        if (!showcase) {
            throw new NotFoundException(`Brosur untuk aplikasi dengan slug '${slug}' tidak ditemukan.`);
        }

        return showcase;
    }
}