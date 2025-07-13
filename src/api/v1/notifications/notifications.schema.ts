import { z } from 'zod';

const objectId = z.string().length(24, 'Invalid ID format');

export const createNotificationSchema = z.object({
  userId: objectId,
  type: z.enum(['order', 'promotion', 'system', 'other']).default('other'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  expiresAt: z.coerce.date().optional(),
});

export const updateNotificationSchema = z.object({
  type: z.enum(['order', 'promotion', 'system', 'other']).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  read: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
  expiresAt: z.coerce.date().optional(),
});

export const notificationParamsSchema = z.object({
  id: objectId,
});

export const listNotificationsQuerySchema = z.object({
  userId: objectId.optional(),
  type: z.enum(['order', 'promotion', 'system', 'other']).optional(),
  read: z.preprocess((val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
  }, z.boolean().optional()),
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
