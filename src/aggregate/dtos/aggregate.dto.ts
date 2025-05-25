import { ApiProperty } from '@nestjs/swagger';
import { GeoResponse } from 'src/geo/interfaces/api-response';
import { WeatherResponse } from 'src/weather/interfaces/api-response';
import { TimezoneResponse } from 'src/timezone/interfaces/api-response';
import { NewsResponse } from 'src/news/interfaces/api-response';
import { CurrencyResponse } from 'src/currency/interfaces/api-response';

export class AggregateSuccessDto {
  @ApiProperty({
    example: 'success',
    description: 'Status of the response',
  })
  status: 'success';

  @ApiProperty({
    description: 'Location',
    example: 'England, United States, etc.',
  })
  location: string;

  @ApiProperty({
    description: 'Geo data based on location',
  })
  geo: GeoResponse;

  @ApiProperty({
    description: 'Weather based on lat and long',
  })
  weather: WeatherResponse;

  @ApiProperty({
    description: 'Timezone based on lat and long',
  })
  timezone: TimezoneResponse;

  @ApiProperty({
    description: 'News based on lat and long',
  })
  news: NewsResponse;

  @ApiProperty({
    description: 'Currency conversion based on lat and long',
  })
  currency: CurrencyResponse;

  constructor(partial?: Partial<AggregateSuccessDto>) {
    Object.assign(this, partial);
  }
}

export class AggregateErrorDto {
  @ApiProperty({
    example: 'error',
    description: 'Status of the response',
  })
  status: 'error';

  @ApiProperty({
    description: 'Error message',
    example: 'Location not found',
  })
  msg: string;

  constructor(partial?: Partial<AggregateErrorDto>) {
    Object.assign(this, partial);
  }
}
