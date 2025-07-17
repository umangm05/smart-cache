import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheController } from './cache.controller';
import { MLTrainer } from 'src/common/Trainer/trainer.service';

@Module({
  providers: [CacheService, MLTrainer],
  controllers: [CacheController]
})

export class CacheModule {
}
