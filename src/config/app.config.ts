import { registerAs } from '@nestjs/config';
import { AppConfig } from 'src/config/app-config.type';
import validateConfig from 'src/utils/validate-config';
import { IsInt, IsString, Max, Min, IsOptional, IsUrl } from 'class-validator';

class EnvironmentVariablesValidator {
  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  @IsOptional()
  API_VERSION: string;

  @IsUrl({ require_tld: true })
  GEO_LOCATION_API: string;

  @IsString()
  GEO_LOCATION_API_KEY: string;

  @IsUrl({ require_tld: true })
  WEATHER_API: string;

  @IsString()
  WEATHER_API_API_KEY: string;

  @IsUrl({ require_tld: true })
  TIMEZONE_API: string;

  @IsString()
  TIMEZONE_API_KEY: string;

  @IsUrl({ require_tld: true })
  NEWS_API: string;

  @IsString()
  NEWS_API_API_KEY: string;

  @IsUrl({ require_tld: true })
  CURRENCY_API: string;

  @IsString()
  CURRENCY_API_API_KEY: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    port: parseInt(process.env.PORT ?? '5001', 10),
    apiPrefix: process.env.API_VERSION || 'v1',
    geoLocationApi: process.env.GEO_LOCATION_API || '',
    geoLocationApiKey: process.env.GEO_LOCATION_API_KEY || '',
    weatherApi: process.env.WEATHER_API || '',
    weatherApiKey: process.env.WEATHER_API_API_KEY || '',
    timezoneApi: process.env.TIMEZONE_API || '',
    timezoneApiKey: process.env.TIMEZONE_API_KEY || '',
    newsApi: process.env.NEWS_API || '',
    newsApiKey: process.env.NEWS_API_API_KEY || '',
    currencyApi: process.env.CURRENCY_API || '',
    currencyApiKey: process.env.CURRENCY_API_API_KEY || '',
  };
});
