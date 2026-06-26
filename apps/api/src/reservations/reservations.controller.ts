import { Controller, Get, Post, Body, Param, UseGuards, Req, Res } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PricingService } from '../pricing/pricing.service';

@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly pricingService: PricingService,
  ) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Post('estimate')
  estimate(@Body() dto: CreateReservationDto) {
    return this.pricingService.calculatePrice(
      dto.vehicleId,
      new Date(dto.startDate),
      new Date(dto.endDate),
      dto.options || { hasGps: false, hasBabySeat: false, hasExtraDriver: false },
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: any) {
    return this.reservationsService.findAllByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.reservationsService.findOne(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/voucher')
  async getVoucher(@Req() req: any, @Param('id') id: string, @Res() res: any) {
    const stream = await this.reservationsService.generateVoucher(id, req.user.userId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=voucher-${id}.pdf`,
    });
    stream.pipe(res);
  }
}
