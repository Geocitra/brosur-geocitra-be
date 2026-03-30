import { PrismaService } from '../../prisma/prisma.service';
export declare class ShowcaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getShowcaseBySlug(slug: string): Promise<{
        slug: string;
        name: string;
        tagline: string;
        primaryColor: string;
        blocks: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
