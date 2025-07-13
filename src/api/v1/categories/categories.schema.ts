import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdSchema = z
  .string()
  .length(24)
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  });

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  parentCategory: objectIdSchema.optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  parentCategory: objectIdSchema.optional(),
});

export const categoryParamsSchema = z.object({
  id: objectIdSchema,
});

export const listCategoriesQuerySchema = z.object({
  parentCategory: objectIdSchema.optional(),
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
