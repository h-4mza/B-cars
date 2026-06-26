import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { FuelType, Transmission } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsInt()
  @Min(2000)
  year: number;

  @IsEnum(FuelType)
  fuel: FuelType;

  @IsEnum(Transmission)
  transmission: Transmission;

  @IsInt()
  @Min(0)
  mileage: number;

  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  pricePerDay: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  deposit: number;
}
