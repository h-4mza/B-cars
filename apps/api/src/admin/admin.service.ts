import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReservationStatus, VehicleStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalReservations,
      activeReservations,
      totalVehicles,
      availableVehicles,
      totalUsers,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.reservation.count(),
      this.prisma.reservation.count({ where: { status: ReservationStatus.ACTIVE } }),
      this.prisma.vehicle.count({ where: { deletedAt: null } }),
      this.prisma.vehicle.count({ where: { status: VehicleStatus.AVAILABLE, deletedAt: null } }),
      this.prisma.user.count(),
      this.prisma.reservation.aggregate({
        _sum: { totalPrice: true },
        where: { status: { in: [ReservationStatus.CONFIRMED, ReservationStatus.COMPLETED, ReservationStatus.ACTIVE] } }
      }),
    ]);

    return {
      totalReservations,
      activeReservations,
      totalVehicles,
      availableVehicles,
      totalUsers,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
    };
  }

  async getPendingDocuments() {
    return this.prisma.document.findMany({
      where: { isVerified: false },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllReservations() {
    return this.prisma.reservation.findMany({
      include: {
        user: true,
        vehicle: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateReservationStatus(id: string, status: ReservationStatus) {
    return this.prisma.reservation.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        vehicle: true,
      }
    });
  }

  async getAllClients() {
    return this.prisma.user.findMany({
      where: { role: 'CLIENT' },
      include: {
        reservations: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
