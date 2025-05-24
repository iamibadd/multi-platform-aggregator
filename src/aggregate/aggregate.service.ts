import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GeoService } from 'src/geo/geo.service';

@Injectable()
export class AggregateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geoService: GeoService,
  ) {}
  async aggregates(location: string) {
    return this.geoService.getCoordinates(location);
  }
}
