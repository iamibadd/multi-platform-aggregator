import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { MemoryCacheService } from 'src/memory-cache/memory-cache.service';
import { GeoService } from 'src/geo/geo.service';
import { WeatherService } from 'src/weather/weather.service';
import { TimezoneService } from 'src/timezone/timezone.service';
import { NewsService } from 'src/news/news.service';
import { CurrencyService } from 'src/currency/currency.service';
import { GeoResponse } from 'src/geo/interfaces/api-response';
import { WeatherResponse } from 'src/weather/interfaces/api-response';
import { TimezoneResponse } from 'src/timezone/interfaces/api-response';
import { NewsResponse } from 'src/news/interfaces/api-response';
import { CurrencyResponse } from 'src/currency/interfaces/api-response';
import { AggregateSuccessDto, AggregateErrorDto } from './dtos/aggregate.dto';

@Injectable()
export class AggregateService {
  constructor(
    private readonly cache: CacheService,
    private readonly memoryCache: MemoryCacheService,
    private readonly geoService: GeoService,
    private readonly weatherService: WeatherService,
    private readonly timezoneService: TimezoneService,
    private readonly newsService: NewsService,
    private readonly currencyService: CurrencyService,
  ) {}
  async aggregates(
    location: string,
  ): Promise<AggregateSuccessDto | AggregateErrorDto> {
    const loc = location.toLowerCase();

    const getFromMemory = this.memoryCache.getMemoryCache(loc);
    if (getFromMemory) {
      const cachedData = getFromMemory as Partial<AggregateSuccessDto>;
      return new AggregateSuccessDto(cachedData);
    }

    const getFromDb = await this.cache.getCachedData(loc);

    if (getFromDb) {
      const cachedData = getFromDb as Partial<AggregateSuccessDto>;
      return new AggregateSuccessDto(cachedData);
    }

    const geo: GeoResponse = await this.geoService.getCoordinates(location);
    if (geo.status === 'success') {
      const {
        coordinates: { lat, lng },
        currency: { iso_code },
      } = geo;

      const [weather, timezone, news, currency]: [
        WeatherResponse,
        TimezoneResponse,
        NewsResponse,
        CurrencyResponse,
      ] = await Promise.all([
        this.weatherService.getWeather(lat, lng),
        this.timezoneService.getTimezone(lat, lng),
        this.newsService.getNews(location),
        this.currencyService.getCurrency(iso_code),
      ]);

      const aggregates: AggregateSuccessDto = {
        status: 'success',
        location,
        geo,
        weather,
        timezone,
        news,
        currency,
      };

      this.memoryCache.setMemoryCache(loc, aggregates);
      await this.cache.setCachedData(loc, aggregates);

      return new AggregateSuccessDto(aggregates);
    }

    const error: AggregateErrorDto = {
      status: 'error',
      msg: `Failed to get geo data for ${location}`,
    };

    return new AggregateErrorDto(error);
  }
}
