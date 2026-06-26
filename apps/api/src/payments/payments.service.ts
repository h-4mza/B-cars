import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import { PaymentStatus, PaymentType, PaymentProvider, ReservationStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

@Injectable()
export class PaymentsService {
  private stripe: any;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY') || 'sk_test_mock', {
      apiVersion: '2025-02-24.acacia' as any,
    });
  }

  async createPaymentIntent(reservationId: string, userId: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { vehicle: true },
    });

    if (!reservation || reservation.userId !== userId) {
      throw new BadRequestException('Réservation introuvable');
    }

    // Create a payment intent in MAD
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(Number(reservation.totalPrice) * 100), // convert to cents
      currency: 'mad',
      metadata: {
        reservationId: reservation.id,
        userId: userId,
      },
    });

    // Create a payment record in our DB (PENDING)
    await this.prisma.payment.create({
      data: {
        reservationId: reservation.id,
        amount: reservation.totalPrice,
        type: PaymentType.FULL,
        provider: PaymentProvider.STRIPE,
        externalId: paymentIntent.id,
        status: PaymentStatus.PENDING,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || '';
    let event: any;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${(err as Error).message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as any;
      const reservationId = paymentIntent.metadata.reservationId;

      // Update payment status
      await this.prisma.payment.updateMany({
        where: { externalId: paymentIntent.id },
        data: { status: PaymentStatus.COMPLETED },
      });

      // Update reservation status
      const updatedReservation = await this.prisma.reservation.update({
        where: { id: reservationId },
        data: { status: ReservationStatus.CONFIRMED },
        include: { user: true, vehicle: true },
      });

      // Send confirmation email
      try {
        await this.notificationsService.sendBookingConfirmation(updatedReservation.user.email, {
          id: updatedReservation.id,
          vehicleName: `${updatedReservation.vehicle.brand} ${updatedReservation.vehicle.model}`,
          startDate: format(new Date(updatedReservation.startDate), 'dd/MM/yyyy', { locale: fr }),
          endDate: format(new Date(updatedReservation.endDate), 'dd/MM/yyyy', { locale: fr }),
          total: updatedReservation.totalPrice,
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email during webhook', emailError);
        // We don't throw here to avoid Stripe retrying a successful payment webhook
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as any;
      await this.prisma.payment.updateMany({
        where: { externalId: paymentIntent.id },
        data: { status: PaymentStatus.FAILED },
      });
    }

    return { received: true };
  }
}
