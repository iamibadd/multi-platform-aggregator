import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';
import { GeoApiResponse, GeoResponse } from './interfaces/api-response';
import { handleError } from 'src/utils/error-catch';

@Injectable()
export class GeoService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async getCoordinates(location: string): Promise<GeoResponse> {
    const api = this.configService.get('app.geoLocationApi', { infer: true });
    const apiKey = this.configService.get('app.geoLocationApiKey', {
      infer: true,
    });
    const url = `${api}/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get<GeoApiResponse>(url),
      );
      const { results } = response.data;
      if (results?.length) {
        const {
          geometry: { lat, lng },
          annotations: { currency },
        } = results[0];
        return { status: 'success', coordinates: { lat, lng }, currency };
      }
      return { status: 'error', msg: `No geo data found for ${location}` };
    } catch (error: unknown) {
      return handleError(error);
    }
  }
}
