import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NewsService } from './news.service';
import { MAX_TIMEOUT, MAX_REDIRECTS } from 'src/https/constants';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: MAX_TIMEOUT,
      maxRedirects: MAX_REDIRECTS,
    }),
  ],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}
