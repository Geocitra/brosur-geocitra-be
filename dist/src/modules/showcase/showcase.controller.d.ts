import { ShowcaseService } from './showcase.service';
export declare class ShowcaseController {
    private readonly showcaseService;
    constructor(showcaseService: ShowcaseService);
    getAllShowcases(): Promise<{
        success: boolean;
        data: {
            slug: string;
            name: string;
            tagline: string;
            primaryColor: string;
        }[];
    }>;
    getShowcaseBySlug(slug: string): Promise<{
        slug: string;
        name: string;
        tagline: string;
        primaryColor: string;
        blocks: import("node_modules/@prisma/client/runtime/library").JsonValue;
    }>;
}
