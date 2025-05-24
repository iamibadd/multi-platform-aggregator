import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AggregateService {
  constructor(private readonly prisma: PrismaService) {}
  async aggregates() {
    const data = {
      location: 'London',
      aggregate: {
        scripts: {
          start: 'nest start',
          build: 'nest build',
          'start:dev': 'nest start --watch',
          test: 'jest',
          lint: 'eslint . --ext .ts',
          'prisma:generate': 'prisma generate',
          'prisma:migrate': 'prisma migrate dev',
          'docker:dev': 'docker-compose up --build',
        },
      },
    };
    return this.prisma.aggregates.create({ data: data });
  }
}
