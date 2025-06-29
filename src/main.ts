import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CacheInterceptor } from './middleware/cache.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new CacheInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
