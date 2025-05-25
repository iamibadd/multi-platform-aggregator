import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CurrencyService } from './currency.service';
import { MAX_TIMEOUT, MAX_REDIRECTS } from 'src/https/constants';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: MAX_TIMEOUT,
      maxRedirects: MAX_REDIRECTS,
    }),
  ],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
