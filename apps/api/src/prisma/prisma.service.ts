import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Connected to database');
    } catch (e: any) {
      console.warn('Could not connect to database on startup. Will try again on query.', e.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
