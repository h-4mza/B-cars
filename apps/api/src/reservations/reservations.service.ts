import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PricingService } from '../pricing/pricing.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationStatus } from '@prisma/client';

@Injectable()
export class ReservationsService {
  constructor(
    private prisma: PrismaService,
    private pricingService: PricingService,
  ) {}

  async create(dto: CreateReservationDto) {
    let userId = 'guest_user';
    if (dto.guestEmail) {
      let user = await this.prisma.user.findUnique({ where: { email: dto.guestEmail } });
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: dto.guestEmail,
            password: 'guest_password_' + Date.now(),
            role: 'CLIENT',
            phone: dto.guestPhone || '',
          }
        });
      }
      userId = user.id;
    } else {
      let user = await this.prisma.user.findUnique({ where: { email: 'guest@location.ma' } });
      if (!user) {
        user = await this.prisma.user.create({
          data: { email: 'guest@location.ma', password: 'guest', role: 'CLIENT' }
        });
      }
      userId = user.id;
    }
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException('La date de début doit être antérieure à la date de fin');
    }

    // Check availability
    const existingReservations = await this.prisma.reservation.findMany({
      where: {
        vehicleId: dto.vehicleId,
        status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
        OR: [
          { startDate: { lte: endDate }, endDate: { gte: startDate } },
        ],
      },
    });

    if (existingReservations.length > 0) {
      throw new BadRequestException('Le véhicule n\'est pas disponible pour ces dates');
    }

    // Calculate price
    const pricing = await this.pricingService.calculatePrice(
      dto.vehicleId,
      startDate,
      endDate,
      dto.options || { hasGps: false, hasBabySeat: false, hasExtraDriver: false },
    );

    const loc = await this.prisma.location.findFirst();
    const fallbackLocId = loc ? loc.id : 'unknown';

    return this.prisma.reservation.create({
      data: {
        userId,
        vehicleId: dto.vehicleId,
        startDate,
        endDate,
        totalPrice: pricing.total,
        options: dto.options ? JSON.stringify(dto.options) : '{}',
        status: ReservationStatus.PENDING,
        pickupLocationId: dto.pickupLocationId || fallbackLocId,
        returnLocationId: dto.returnLocationId || fallbackLocId,
        pickupTime: dto.pickupTime || '10:00',
        returnTime: dto.returnTime || '10:00',
        driverAge: dto.driverAge || '25+',
        driverCountry: dto.driverCountry || 'MA',
      },
      include: {
        vehicle: true,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.reservation.findMany({
      where: { userId },
      include: { vehicle: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.reservation.findFirst({
      where: { id, userId },
      include: { vehicle: true, payments: true },
    });
  }

  async generateVoucher(id: string, userId: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id, userId },
      include: { vehicle: true, user: true }
    });

    if (!reservation) throw new BadRequestException('Reservation not found');

    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    
    doc.fontSize(25).text('Bon de Reservation - B CARS', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Reservation #${reservation.id}`);
    doc.moveDown();
    doc.fontSize(14).text(`Vehicule: ${reservation.vehicle.brand} ${reservation.vehicle.model}`);
    doc.text(`Prise en charge: ${reservation.startDate.toDateString()}`);
    doc.text(`Retour: ${reservation.endDate.toDateString()}`);
    doc.text(`Prix Total: ${reservation.totalPrice} MAD`);
    doc.moveDown();
    if (reservation.user) {
      doc.text(`Client: ${reservation.user.email}`);
    }
    
    doc.end();
    
    return doc;
  }
}
