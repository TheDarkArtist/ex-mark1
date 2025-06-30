import { z } from 'zod';

export const createReviewSchema = z.object({
  product_id: z.string().length(24, "Invalid product ID format"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().optional(),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export const reviewParamsSchema = z.object({
  id: z.string().length(24, "Invalid review ID format"),
});

export const listReviewsQuerySchema = z.object({
  user_id: z.string().length(24, "Invalid user ID format").optional(),
  product_id: z.string().length(24, "Invalid product ID format").optional(),
  page: z.preprocess(val => (val ? Number(val) : 1), z.number().int().positive()),
  limit: z.preprocess(val => (val ? Number(val) : 10), z.number().int().positive()),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

