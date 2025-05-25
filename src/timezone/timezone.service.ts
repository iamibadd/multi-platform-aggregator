import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';
import {
  TimezoneApiResponse,
  TimezoneResponse,
} from './interfaces/api-response';

@Injectable()
export class TimezoneService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async getTimezone(lat: number, lng: number): Promise<TimezoneResponse> {
    const api = this.configService.get('app.timezoneApi', { infer: true });
    const apiKey = this.configService.get('app.timezoneApiKey', {
      infer: true,
    });
    const url = `${api}/v2.1/get-time-zone?lat=${lat}&lng=${lng}&key=${apiKey}&format=json&by=position`;

    try {
      const response = await firstValueFrom(
        this.httpService.get<TimezoneApiResponse>(url),
      );

      return {
        data: response.data,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          status: 'error',
          msg: error.message,
        };
      }
      return {
        status: 'error',
        msg: `Something went wrong `,
      };
    }
  }
}
