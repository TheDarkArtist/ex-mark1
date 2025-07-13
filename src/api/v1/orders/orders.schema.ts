import { z } from 'zod';

export const orderItemSchema = z.object({
  product_id: z.string().length(24, 'Invalid product ID format'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

export const shippingAddressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
});

export const createOrderSchema = z.object({
  user_id: z.string().length(24, 'Invalid user ID format'),
  products: z.array(orderItemSchema).min(1, 'At least one product is required'),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum([
    'credit_card',
    'paypal',
    'cash_on_delivery',
    'stripe',
  ]),
});

export const updateOrderSchema = z.object({
  products: z
    .array(orderItemSchema)
    .min(1, 'At least one product is required')
    .optional(),
  shippingAddress: shippingAddressSchema.optional(),
  paymentMethod: z
    .enum(['credit_card', 'paypal', 'cash_on_delivery', 'stripe'])
    .optional(),
  status: z
    .enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  transactionId: z.string().optional(),
});

export const listOrdersQuerySchema = z.object({
  user_id: z.string().length(24, 'Invalid user ID format').optional(),
  status: z
    .enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  page: z.preprocess(
    (val) => (val ? Number(val) : 1),
    z.number().int().positive(),
  ),
  limit: z.preprocess(
    (val) => (val ? Number(val) : 10),
    z.number().int().positive(),
  ),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const orderParamsSchema = z.object({
  id: z.string().length(24, 'Invalid order ID format'),
});
