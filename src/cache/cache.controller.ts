import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CacheService } from './cache.service';
import { MLTrainer } from 'src/common/Trainer/trainer.service';

@Controller('cache')
export class CacheController {
    constructor(private cacheService: CacheService, private mlTrainer: MLTrainer) { }


    @Get()
    findAll() {
        return this.cacheService.getAll()
    }

    @Get('/train')
    train() {
        return this.mlTrainer.trainModel()
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
