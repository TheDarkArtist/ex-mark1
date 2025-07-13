import mongoose, { Schema, Document, Model } from 'mongoose';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'canceled';

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  amount: number; // in smallest currency unit, e.g., cents
  currency: string; // e.g., 'USD'
  status: PaymentStatus;
  paymentProvider: string; // e.g., 'stripe', 'paypal'
  providerPaymentId?: string; // ID returned by payment gateway
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'USD' },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'canceled'],
      default: 'pending',
    },
    paymentProvider: { type: String, required: true },
    providerPaymentId: { type: String },
  },
  { timestamps: true },
);

const Payment: Model<IPayment> = mongoose.model<IPayment>(
  'Payment',
  paymentSchema,
);

export default Payment;
