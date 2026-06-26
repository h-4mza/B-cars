import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface PricingOptions {
  hasGps: boolean;
  hasBabySeat: boolean;
  hasExtraDriver: boolean;
}

@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

  async calculatePrice(
    vehicleId: string,
    startDate: Date,
    endDate: Date,
    options: PricingOptions,
  ) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    let basePrice = Number(vehicle.pricePerDay) * diffDays;

    // Seasonal modifiers
    const startMonth = startDate.getMonth(); // 0-indexed (5 = June, 8 = Sept)
    if (startMonth >= 5 && startMonth <= 8) {
      basePrice *= 1.20; // +20% Summer
    } else if (startMonth === 11 || startMonth <= 1) {
      basePrice *= 0.90; // -10% Winter
    }

    // Duration discounts
    if (diffDays >= 30) {
      basePrice *= 0.85; // -15%
    } else if (diffDays >= 7) {
      basePrice *= 0.95; // -5%
    }

    // Options
    let optionsPrice = 0;
    if (options.hasGps) optionsPrice += 50 * diffDays;
    if (options.hasBabySeat) optionsPrice += 30 * diffDays;
    if (options.hasExtraDriver) optionsPrice += 40 * diffDays;

    const total = basePrice + optionsPrice;
    const deposit = Number(vehicle.depositAmount);

    return {
      days: diffDays,
      basePrice: Math.round(basePrice * 100) / 100,
      optionsPrice: Math.round(optionsPrice * 100) / 100,
      total: Math.round(total * 100) / 100,
      deposit: Math.round(deposit * 100) / 100,
    };
  }
}
