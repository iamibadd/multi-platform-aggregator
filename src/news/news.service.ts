import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';
import { NewsApiResponse, NewsResponse } from './interfaces/api-response';

@Injectable()
export class NewsService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async getNews(location: string): Promise<NewsResponse> {
    const api = this.configService.get('app.newsApi', { infer: true });
    const apiKey = this.configService.get('app.newsApiKey', {
      infer: true,
    });
    const url = `${api}/v2/everything?q=${location}&sortBy=publishedAt&apiKey=${apiKey}&pageSize=1`;

    try {
      const response = await firstValueFrom(
        this.httpService.get<NewsApiResponse>(url),
      );

      return {
        status: 'success',
        articles: response.data?.articles,
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
