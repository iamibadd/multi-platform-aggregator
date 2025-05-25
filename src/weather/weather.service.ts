import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';
import { WeatherApiResponse, WeatherResponse } from './interfaces/api-response';
import { handleError } from 'src/utils/error-catch';

@Injectable()
export class WeatherService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async getWeather(lat: number, lng: number): Promise<WeatherResponse> {
    const api = this.configService.get('app.weatherApi', { infer: true });
    const apiKey = this.configService.get('app.weatherApiKey', {
      infer: true,
    });
    const url = `${api}/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get<WeatherApiResponse>(url),
      );
      const { coord, weather } = response.data;
      return {
        status: 'success',
        coordinates: coord,
        weather: { ...weather[0] },
      };
    } catch (error: unknown) {
      return handleError(error);
    }
  }
}
