import { ShowcaseService } from './showcase.service';
export declare class ShowcaseController {
    private readonly showcaseService;
    constructor(showcaseService: ShowcaseService);
    getShowcase(slug: string): Promise<{
        slug: string;
        name: string;
        tagline: string;
        primaryColor: string;
        blocks: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
