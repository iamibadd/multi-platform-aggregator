import { Module } from '@nestjs/common';
import { AggregateService } from './aggregate.service';
import { AggregateController } from './aggregate.controller';
import { GeoModule } from 'src/geo/geo.module';
import { WeatherModule } from 'src/weather/weather.module';

@Module({
  controllers: [AggregateController],
  providers: [AggregateService],
  imports: [GeoModule, WeatherModule],
})
export class AggregateModule {}
