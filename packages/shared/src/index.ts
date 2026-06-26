import { FuelType, Transmission, VehicleStatus } from '@prisma/client';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  fuel: FuelType;
  transmission: Transmission;
  mileage: number;
  licensePlate: string;
  status: VehicleStatus;
  pricePerDay: number;
  deposit: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleFilters {
  brand?: string;
  status?: VehicleStatus;
  fuel?: FuelType;
  transmission?: Transmission;
}
