import { Controller, Get, Param } from '@nestjs/common';
import { ShowcaseService } from './showcase.service';

@Controller('showcase')
export class ShowcaseController {
    constructor(private readonly showcaseService: ShowcaseService) { }

    @Get(':slug')
    async getShowcase(@Param('slug') slug: string) {
        return this.showcaseService.getShowcaseBySlug(slug);
    }
}