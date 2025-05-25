import {
  Controller,
  Get,
  Query,
  HttpStatus,
  HttpCode,
  BadRequestException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiQuery,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { AggregateService } from './aggregate.service';
import { AggregateSuccessDto, AggregateErrorDto } from './dtos/aggregate.dto';

@Controller('aggregate')
@ApiExtraModels(AggregateSuccessDto, AggregateErrorDto)
@UseInterceptors(ClassSerializerInterceptor)
export class AggregateController {
  constructor(private readonly aggregateService: AggregateService) {}
  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'location', required: true, type: String })
  @ApiOkResponse({
    description: 'Get multi platform aggregates',
    schema: {
      oneOf: [
        { $ref: getSchemaPath(AggregateSuccessDto) },
        { $ref: getSchemaPath(AggregateErrorDto) },
      ],
    },
  })
  async aggregates(
    @Query('location') location: string,
  ): Promise<AggregateSuccessDto | AggregateErrorDto> {
    if (!location) {
      throw new BadRequestException('location is a required parameter');
    }
    const aggregates = await this.aggregateService.aggregates(location);

    if (aggregates.status === 'error') {
      return new AggregateErrorDto(aggregates);
    }

    return new AggregateSuccessDto(aggregates);
  }
}
