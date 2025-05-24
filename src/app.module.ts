import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from 'src/config/app.config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GeoService } from 'src/geo/geo.service';
import { GeoModule } from 'src/geo/geo.module';
import { WeatherService } from 'src/weather/weather.service';
import { WeatherModule } from 'src/weather/weather.module';
import { TimezoneService } from 'src/timezone/timezone.service';
import { TimezoneModule } from 'src/timezone/timezone.module';
import { NewsService } from 'src/news/news.service';
import { NewsModule } from 'src/news/news.module';
import { CurrencyService } from 'src/currency/currency.service';
import { CurrencyModule } from 'src/currency/currency.module';
import { CacheService } from 'src/cache/cache.service';
import { CacheModule } from 'src/cache/cache.module';
import { AggregateService } from 'src/aggregate/aggregate.service';
import { AggregateModule } from 'src/aggregate/aggregate.module';
import { AggregateController } from 'src/aggregate/aggregate.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
    PrismaModule,
    GeoModule,
    WeatherModule,
    TimezoneModule,
    NewsModule,
    CurrencyModule,
    CacheModule,
    AggregateModule,
    HttpModule,
  ],
  controllers: [AggregateController],
  providers: [
    GeoService,
    WeatherService,
    TimezoneService,
    NewsService,
    CurrencyService,
    CacheService,
    AggregateService,
  ],
})
export class AppModule {}
