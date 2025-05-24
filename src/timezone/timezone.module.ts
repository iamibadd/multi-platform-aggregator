import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TimezoneService } from './timezone.service';
import { MAX_TIMEOUT, MAX_REDIRECTS } from 'src/https/constants';
@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: MAX_TIMEOUT,
      maxRedirects: MAX_REDIRECTS,
    }),
  ],
  providers: [TimezoneService],
  exports: [TimezoneService],
})
export class TimezoneModule {}
