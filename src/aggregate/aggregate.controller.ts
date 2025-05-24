import { Controller, Get } from '@nestjs/common';
import { AggregateService } from './aggregate.service';

@Controller('aggregate')
export class AggregateController {
  constructor(private readonly aggregateService: AggregateService) {}
  @Get('')
  async aggregates() {
    return this.aggregateService.aggregates();
  }
}
