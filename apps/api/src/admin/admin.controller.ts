import { Controller, Get, Post, Param, Body, UseGuards, Patch } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { DocumentsService } from '../documents/documents.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.AGENT)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly documentsService: DocumentsService,
  ) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('documents/pending')
  getPendingDocuments() {
    return this.adminService.getPendingDocuments();
  }

  @Patch('documents/:id/verify')
  verifyDocument(
    @Param('id') id: string,
    @Body('isVerified') isVerified: boolean,
  ) {
    return this.documentsService.verifyDocument(id, isVerified);
  }

  @Get('reservations')
  getAllReservations() {
    return this.adminService.getAllReservations();
  }

  @Patch('reservations/:id/status')
  updateReservationStatus(
    @Param('id') id: string,
    @Body('status') status: any,
  ) {
    return this.adminService.updateReservationStatus(id, status);
  }

  @Get('clients')
  getAllClients() {
    return this.adminService.getAllClients();
  }
}
