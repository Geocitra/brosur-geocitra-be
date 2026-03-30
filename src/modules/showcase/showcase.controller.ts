import { Controller, Get, Param } from '@nestjs/common';
import { ShowcaseService } from './showcase.service';

@Controller('showcase')
export class ShowcaseController {
    constructor(private readonly showcaseService: ShowcaseService) { }

    // [BARU] GET /api/showcase -> Untuk mengambil semua data brosur
    @Get()
    async getAllShowcases() {
        const data = await this.showcaseService.getAllShowcases();
        // Bungkus dengan standar JSON balasan jika diperlukan, 
        // atau langsung return datanya agar sesuai dengan asumsi Frontend
        return {
            success: true,
            data: data,
        };
    }

    // GET /api/showcase/:slug -> Untuk mengambil detail 1 brosur
    @Get(':slug')
    async getShowcaseBySlug(@Param('slug') slug: string) {
        return this.showcaseService.getShowcaseBySlug(slug);
    }
}