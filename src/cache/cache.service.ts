import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CacheService {
  constructor(private prisma: PrismaService) {}
}
