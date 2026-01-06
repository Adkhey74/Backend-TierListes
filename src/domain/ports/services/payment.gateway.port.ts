export interface PaymentIntentResult {
  paymentIntentId: string;
  clientSecret: string;
  status:
    | 'requires_payment_method'
    | 'requires_confirmation'
    | 'succeeded'
    | 'failed';
}

export interface PaymentGatewayPort {
  createPaymentIntent(
    amount: number,
    currency?: string,
  ): Promise<PaymentIntentResult>;
  confirmPayment(paymentIntentId: string): Promise<boolean>;
  getPaymentStatus(paymentIntentId: string): Promise<string>;
}

export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');
