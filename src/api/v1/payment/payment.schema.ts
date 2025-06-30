import { z } from 'zod';

export const createPaymentSchema = z.object({
  orderId: z.string().length(24, "Invalid orderId length"),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().optional().default('usd'),
});

export const paymentIdParamsSchema = z.object({
  paymentId: z.string().length(24, "Invalid paymentId length"),
});
