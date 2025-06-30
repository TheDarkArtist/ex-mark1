import mongoose, { Types } from 'mongoose';
import Payment, { type IPayment, type PaymentStatus } from './payment.model';
import { BadRequestError, NotFoundError } from '../../../utils/app-error';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set. Application cannot start.');
}

// Initialize Stripe with explicit API version (adjust as needed)
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-05-28.basil' });

export class PaymentService {
  /**
   * Create a Stripe PaymentIntent and save payment record in DB.
   * Returns the payment document and clientSecret for frontend.
   */
  async createPayment(
    userId: string,
    orderId: string,
    amount: number,
    currency = 'usd'
  ): Promise<{ payment: IPayment; clientSecret: string }> {
    // Validate MongoDB ObjectIds
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Invalid user ID');
    }
    if (!Types.ObjectId.isValid(orderId)) {
      throw new BadRequestError('Invalid order ID');
    }
    if (amount <= 0) {
      throw new BadRequestError('Amount must be positive');
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { orderId, userId },
    });

    // Create and save payment record in MongoDB
    const payment = new Payment({
      user: new mongoose.Types.ObjectId(userId),
      order: new mongoose.Types.ObjectId(orderId),
      amount,
      currency,
      status: 'pending',
      paymentProvider: 'stripe',
      providerPaymentId: paymentIntent.id,
    });

    await payment.save();

    return {
      payment,
      clientSecret: paymentIntent.client_secret!,
    };
  }

  /**
   * Update payment status by providerPaymentId (e.g., Stripe PaymentIntent ID).
   */
  async updatePaymentStatus(providerPaymentId: string, status: PaymentStatus): Promise<IPayment> {
    const payment = await Payment.findOne({ providerPaymentId });
    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    payment.status = status;
    await payment.save();

    return payment;
  }

  /**
   * Retrieve a payment by its MongoDB _id.
   */
  async getPaymentById(paymentId: string): Promise<IPayment | null> {
    if (!Types.ObjectId.isValid(paymentId)) {
      throw new BadRequestError('Invalid payment ID');
    }
    return Payment.findById(paymentId).exec();
  }
}

