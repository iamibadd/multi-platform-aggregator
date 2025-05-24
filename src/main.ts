import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllConfigType } from './config/config.type';
import { ConfigService } from '@nestjs/config';
import { PrismaExceptionFilter } from 'src/filters/prisma-exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AllConfigType>);
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    { exclude: ['/'] },
  );
  app.useGlobalFilters(new PrismaExceptionFilter());
  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}
void bootstrap();
