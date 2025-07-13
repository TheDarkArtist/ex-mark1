import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdSchema = z
  .string()
  .length(24)
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  });

export const cartItemSchema = z.object({
  productId: objectIdSchema,
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const cartItemsSchema = z
  .array(cartItemSchema)
  .nonempty('Cart must have at least one item');

export const cartSchema = z.object({
  userId: objectIdSchema,
  items: cartItemsSchema,
});

export const cartParamsSchema = z.object({
  userId: objectIdSchema,
});

export const cartQuerySchema = z.object({
  page: z.preprocess(
    (val) => (val ? Number(val) : 1),
    z.number().int().positive(),
  ),
  limit: z.preprocess(
    (val) => (val ? Number(val) : 10),
    z.number().int().positive(),
  ),
});
