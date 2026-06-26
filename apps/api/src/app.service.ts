import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'B CARS API is running!';
  }

  getLocations() {
    return this.prisma.location.findMany({
      where: { isActive: true },
      orderBy: [
        { type: 'asc' },
        { city: 'asc' }
      ]
    });
  }
}
