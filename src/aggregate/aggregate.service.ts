import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GeoService } from 'src/geo/geo.service';
import { WeatherService } from 'src/weather/weather.service';
import { TimezoneService } from 'src/timezone/timezone.service';

@Injectable()
export class AggregateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geoService: GeoService,
    private readonly weatherService: WeatherService,
    private readonly timezoneService: TimezoneService,
  ) {}
  async aggregates(lat: number, lng: number) {
    // return this.geoService.getCoordinates(location);
    // return this.weatherService.getWeather(lat, lng);
    return this.timezoneService.getWeather(lat, lng);
  }
}
