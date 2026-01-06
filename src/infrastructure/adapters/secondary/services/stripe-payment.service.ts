import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PaymentGatewayPort,
  PaymentIntentResult,
} from '../../../../domain/ports/services/payment.gateway.port';

@Injectable()
export class StripePaymentService implements PaymentGatewayPort {
  constructor(private readonly configService: ConfigService) {
    // En production, initialiser le client Stripe ici
    // const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
  }

  async createPaymentIntent(
    amount: number,
    currency = 'eur',
  ): Promise<PaymentIntentResult> {
    // TODO: Implémenter avec le vrai SDK Stripe
    // Pour l'instant, retourne un mock
    const mockPaymentIntentId = `pi_mock_${Date.now()}`;

    return {
      paymentIntentId: mockPaymentIntentId,
      clientSecret: `${mockPaymentIntentId}_secret_mock`,
      status: 'requires_payment_method',
    };
  }

  async confirmPayment(paymentIntentId: string): Promise<boolean> {
    // TODO: Implémenter avec le vrai SDK Stripe
    // Pour l'instant, simule toujours un succès
    return true;
  }

  async getPaymentStatus(paymentIntentId: string): Promise<string> {
    // TODO: Implémenter avec le vrai SDK Stripe
    return 'succeeded';
  }
}
