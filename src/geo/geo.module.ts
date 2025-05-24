import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GeoService } from './geo.service';
import { MAX_TIMEOUT, MAX_REDIRECTS } from 'src/https/constants';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: MAX_TIMEOUT,
      maxRedirects: MAX_REDIRECTS,
    }),
  ],
  providers: [GeoService],
  exports: [GeoService],
})
export class GeoModule {}
