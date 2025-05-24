import { registerAs } from '@nestjs/config';
import { AppConfig } from './app-config.type';
import validateConfig from '.././utils/validate-config';
import { IsInt, IsString, Max, Min, IsOptional } from 'class-validator';

class EnvironmentVariablesValidator {
  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  @IsOptional()
  API_VERSION: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    port: parseInt(process.env.PORT ?? '5001', 10),
    apiPrefix: process.env.API_VERSION || 'v1',
  };
});
