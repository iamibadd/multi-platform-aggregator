import { Module } from '@nestjs/common';
import { AggregateService } from './aggregate.service';
import { AggregateController } from './aggregate.controller';
import { GeoModule } from 'src/geo/geo.module';
import { WeatherModule } from 'src/weather/weather.module';
import { TimezoneModule } from 'src/timezone/timezone.module';

@Module({
  controllers: [AggregateController],
  providers: [AggregateService],
  imports: [GeoModule, WeatherModule, TimezoneModule],
})
export class AggregateModule {}
