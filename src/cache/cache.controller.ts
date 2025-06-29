import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CacheService } from './cache.service';

@Controller('cache')
export class CacheController {
    constructor(private cacheService: CacheService) { }


    @Get()
    findAll() {
        return this.cacheService.getAll()
    }

    @Get("/:id")
    find(@Param("id") id: string) {
        return this.cacheService.get(id)
    }

    @Post()
    insert(@Body() user) {
        return this.cacheService.put(user)
    }
}
