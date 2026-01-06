import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  Payment,
  PaymentStatus,
} from '../../../../domain/entities/payment.entity';
import {
  PaymentRepositoryPort,
  CreatePaymentData,
} from '../../../../domain/ports/repositories/payment.repository.port';
import { PaymentStatus as PrismaPaymentStatus } from 'generated/prisma/enums';

@Injectable()
export class PrismaPaymentRepository implements PaymentRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(prismaPayment: {
    id: string;
    userId: string;
    tierListId: string;
    amount: number;
    stripePaymentId: string;
    status: PrismaPaymentStatus;
    createdAt: Date;
  }): Payment {
    return Payment.create({
      id: prismaPayment.id,
      userId: prismaPayment.userId,
      tierListId: prismaPayment.tierListId,
      amount: prismaPayment.amount,
      stripePaymentId: prismaPayment.stripePaymentId,
      status: prismaPayment.status as unknown as PaymentStatus,
      createdAt: prismaPayment.createdAt,
    });
  }

  async findById(id: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) return null;

    return this.toDomain(payment);
  }

  async findByTierListId(tierListId: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { tierListId },
    });

    if (!payment) return null;

    return this.toDomain(payment);
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany({
      where: { userId },
    });

    return payments.map((p) => this.toDomain(p));
  }

  async create(data: CreatePaymentData): Promise<Payment> {
    const payment = await this.prisma.payment.create({
      data: {
        userId: data.userId,
        tierListId: data.tierListId,
        amount: data.amount,
        stripePaymentId: data.stripePaymentId,
      },
    });

    return this.toDomain(payment);
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<Payment> {
    const payment = await this.prisma.payment.update({
      where: { id },
      data: { status: status as unknown as PrismaPaymentStatus },
    });

    return this.toDomain(payment);
  }
}

