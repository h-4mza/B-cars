import { IsDateString, IsNotEmpty, IsObject, IsString, IsOptional } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsObject()
  @IsOptional()
  options?: any;

  @IsString()
  @IsOptional()
  pickupLocationId?: string;

  @IsString()
  @IsOptional()
  returnLocationId?: string;

  @IsString()
  @IsOptional()
  pickupTime?: string;

  @IsString()
  @IsOptional()
  returnTime?: string;

  @IsString()
  @IsOptional()
  driverAge?: string;

  @IsString()
  @IsOptional()
  driverCountry?: string;

  @IsString()
  @IsOptional()
  guestEmail?: string;

  @IsString()
  @IsOptional()
  guestPhone?: string;

  @IsString()
  @IsOptional()
  guestName?: string;
}
