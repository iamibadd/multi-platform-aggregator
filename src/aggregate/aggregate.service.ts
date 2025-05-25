import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GeoService } from 'src/geo/geo.service';
import { WeatherService } from 'src/weather/weather.service';
import { TimezoneService } from 'src/timezone/timezone.service';
import { NewsService } from 'src/news/news.service';

@Injectable()
export class AggregateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geoService: GeoService,
    private readonly weatherService: WeatherService,
    private readonly timezoneService: TimezoneService,
    private readonly newsService: NewsService,
  ) {}
  async aggregates(location: string) {
    // return this.geoService.getCoordinates(location);
    // return this.weatherService.getWeather(lat, lng);
    // return this.timezoneService.getTimezone(lat, lng);
    return this.newsService.getNews(location);
  }
}
