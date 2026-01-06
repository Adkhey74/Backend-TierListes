import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Payment, PaymentStatus } from '../../../domain/entities/payment.entity';
import { TierListStatus } from '../../../domain/entities/tier-list.entity';
import {
  PaymentRepositoryPort,
  PAYMENT_REPOSITORY,
} from '../../../domain/ports/repositories/payment.repository.port';
import {
  TierListRepositoryPort,
  TIER_LIST_REPOSITORY,
} from '../../../domain/ports/repositories/tier-list.repository.port';
import {
  PaymentGatewayPort,
  PAYMENT_GATEWAY,
} from '../../../domain/ports/services/payment.gateway.port';

export interface ProcessPaymentCommand {
  userId: string;
  tierListId: string;
  amount: number;
}

export interface ProcessPaymentResult {
  payment: Payment;
  clientSecret: string;
}

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepositoryPort,
    @Inject(TIER_LIST_REPOSITORY)
    private readonly tierListRepository: TierListRepositoryPort,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async execute(command: ProcessPaymentCommand): Promise<ProcessPaymentResult> {
    const tierList = await this.tierListRepository.findById(command.tierListId);

    if (!tierList) {
      throw new NotFoundException('TierList non trouvée');
    }

    if (tierList.isPaid()) {
      throw new BadRequestException('Cette TierList est déjà payée');
    }

    if (tierList.userId !== command.userId) {
      throw new BadRequestException(
        "Vous n'êtes pas propriétaire de cette TierList",
      );
    }

    // Créer le payment intent via Stripe
    const paymentIntent = await this.paymentGateway.createPaymentIntent(
      command.amount,
    );

    // Enregistrer le payment en base
    const payment = await this.paymentRepository.create({
      userId: command.userId,
      tierListId: command.tierListId,
      amount: command.amount,
      stripePaymentId: paymentIntent.paymentIntentId,
    });

    return {
      payment,
      clientSecret: paymentIntent.clientSecret,
    };
  }

  async confirmPayment(paymentId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findById(paymentId);

    if (!payment) {
      throw new NotFoundException('Payment non trouvé');
    }

    // Vérifier le statut auprès de Stripe
    const isConfirmed = await this.paymentGateway.confirmPayment(
      payment.stripePaymentId,
    );

    if (isConfirmed) {
      // Mettre à jour le payment
      const updatedPayment = await this.paymentRepository.updateStatus(
        paymentId,
        PaymentStatus.SUCCESS,
      );

      // Mettre à jour le statut de la TierList
      await this.tierListRepository.updateStatus(
        payment.tierListId,
        TierListStatus.PAID,
      );

      return updatedPayment;
    }

    return this.paymentRepository.updateStatus(paymentId, PaymentStatus.FAILED);
  }
}
