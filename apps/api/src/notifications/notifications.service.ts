import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class NotificationsService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
    }
  }

  async sendEmail(to: string, subject: string, html: string) {
    if (!this.resend) {
      console.log('Email sending skipped: RESEND_API_KEY is not configured');
      return;
    }
    try {
      await this.resend.emails.send({
        from: 'Location Maroc <noreply@votre-domaine.com>', // Note: Nécessite un domaine validé sur Resend
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Email failed to send', error);
      throw error;
    }
  }

  async sendBookingConfirmation(to: string, details: any) {
    const html = `
      <div style="font-family: sans-serif; color: #1B2B5E;">
        <h1 style="color: #C9A84C;">Réservation Confirmée !</h1>
        <p>Merci d'avoir choisi <strong>Location Maroc</strong>.</p>
        <p>Votre réservation pour le véhicule <strong>${details.vehicleName}</strong> a été enregistrée avec succès.</p>
        <hr />
        <ul>
          <li><strong>ID Réservation :</strong> ${details.id}</li>
          <li><strong>Dates :</strong> du ${details.startDate} au ${details.endDate}</li>
          <li><strong>Montant Total :</strong> ${details.total} MAD</li>
        </ul>
        <p>Vous pouvez consulter les détails et vos documents dans votre <a href="${process.env.FRONTEND_URL}/dashboard">Espace Client</a>.</p>
      </div>
    `;
    return this.sendEmail(to, 'Confirmation de votre réservation - Location Maroc', html);
  }
}
