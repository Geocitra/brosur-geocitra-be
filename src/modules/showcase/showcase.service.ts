import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ShowcaseService {
    constructor(private readonly prisma: PrismaService) { }

    async getShowcaseBySlug(slug: string) {
        const showcase = await this.prisma.productShowcase.findUnique({
            where: { slug },
        });

        if (!showcase) {
            throw new NotFoundException(`Brosur untuk aplikasi dengan slug '${slug}' tidak ditemukan.`);
        }

        return showcase;
    }
}