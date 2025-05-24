import { Controller, Get, Query } from '@nestjs/common';
import { AggregateService } from './aggregate.service';

@Controller('aggregate')
export class AggregateController {
  constructor(private readonly aggregateService: AggregateService) {}
  @Get('')
  async aggregates(@Query('lat') lat: number, @Query('lng') lng: number) {
    return this.aggregateService.aggregates(lat, lng);
  }
}
