import { Payment, PaymentStatus } from '../../entities/payment.entity';

export interface CreatePaymentData {
  userId: string;
  tierListId: string;
  amount: number;
  stripePaymentId: string;
}

export interface PaymentRepositoryPort {
  findById(id: string): Promise<Payment | null>;
  findByTierListId(tierListId: string): Promise<Payment | null>;
  findByUserId(userId: string): Promise<Payment[]>;
  create(data: CreatePaymentData): Promise<Payment>;
  updateStatus(id: string, status: PaymentStatus): Promise<Payment>;
}

export const PAYMENT_REPOSITORY = Symbol('PAYMENT_REPOSITORY');
