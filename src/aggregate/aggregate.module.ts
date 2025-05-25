import { Module } from '@nestjs/common';
import { AggregateService } from './aggregate.service';
import { AggregateController } from './aggregate.controller';
import { GeoModule } from 'src/geo/geo.module';
import { WeatherModule } from 'src/weather/weather.module';
import { TimezoneModule } from 'src/timezone/timezone.module';
import { NewsModule } from 'src/news/news.module';
import { CurrencyModule } from 'src/currency/currency.module';
import { CacheModule } from 'src/cache/cache.module';
import { MemoryCacheModule } from 'src/memory-cache/memory-cache.module';

@Module({
  controllers: [AggregateController],
  providers: [AggregateService],
  imports: [
    GeoModule,
    WeatherModule,
    TimezoneModule,
    NewsModule,
    CurrencyModule,
    CacheModule,
    MemoryCacheModule,
  ],
})
export class AggregateModule {}
