import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';
import {
  CurrencyApiResponse,
  CurrencyResponse,
} from './interfaces/api-response';
import { handleError } from 'src/utils/error-catch';

@Injectable()
export class CurrencyService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async getCurrency(currency: string): Promise<CurrencyResponse> {
    const api = this.configService.get('app.currencyApi', { infer: true });
    const apiKey = this.configService.get('app.currencyApiKey', {
      infer: true,
    });
    const url = `${api}/v6/${apiKey}/latest/${currency}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get<CurrencyApiResponse>(url),
      );

      const { conversion_rates } = response.data;

      return {
        status: 'success',
        conversion_rates,
      };
    } catch (error: unknown) {
      return handleError(error);
    }
  }
}
