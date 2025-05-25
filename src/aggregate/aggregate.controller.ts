import { Controller, Get, Query } from '@nestjs/common';
import { AggregateService } from './aggregate.service';

@Controller('aggregate')
export class AggregateController {
  constructor(private readonly aggregateService: AggregateService) {}
  @Get('')
  async aggregates(@Query('location') location: string) {
    return this.aggregateService.aggregates(location);
  }
}
