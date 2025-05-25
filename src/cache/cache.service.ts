import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CacheService {
  constructor(private prisma: PrismaService) {}
  private readonly TTL = 10 * 60 * 1000;

  async getCachedData(location: string) {
    const record = await this.prisma.aggregates.findUnique({
      where: { location },
    });
    if (
      record &&
      new Date().getTime() - new Date(record.updatedAt).getTime() < this.TTL
    ) {
      return record.aggregate;
    }
    return null;
  }

  async setCachedData(location: string, data: object) {
    return this.prisma.aggregates.upsert({
      where: { location },
      update: { aggregate: data },
      create: { location, aggregate: data },
    });
  }
}
