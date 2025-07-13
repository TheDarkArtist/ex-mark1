import { z } from 'zod';

export const createProductSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1, 'Description is required'),
    price: z.number().positive(),
    sku: z.string().min(1),
    stock: z.number().int().nonnegative().default(0),
    category_id: z.string().length(24),
    images: z.array(z.string().url()).optional(),
    brand: z.string().optional(),
    weight: z.number().optional(),
    dimensions: z
      .object({
        width: z.number().optional(),
        height: z.number().optional(),
        depth: z.number().optional(),
      })
      .optional(),
  })
  .strict();

export const updateProductSchema = createProductSchema.partial();

export const productParamsSchema = z.object({
  id: z.string().length(24),
});

export const listProductsQuerySchema = z.object({
  category_id: z.string().length(24).optional(),
  priceMin: z.preprocess((val) => Number(val), z.number().optional()),
  priceMax: z.preprocess((val) => Number(val), z.number().optional()),
  search: z.string().optional(),
  page: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().optional(),
  ),
  limit: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().optional(),
  ),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
