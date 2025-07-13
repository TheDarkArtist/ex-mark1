import { Types } from 'mongoose';
import Notification from './notifications.model';
import type { z } from 'zod';
import type {
  createNotificationSchema,
  listNotificationsQuerySchema,
  updateNotificationSchema,
} from './notifications.schema';

export const createNotification = async (
  input: z.infer<typeof createNotificationSchema>,
) => {
  return await Notification.create(input);
};

export const getNotificationById = async (id: string) => {
  return await Notification.findById(id);
};

export const updateNotification = async (
  id: string,
  data: z.infer<typeof updateNotificationSchema>,
) => {
  return await Notification.findByIdAndUpdate(id, data, { new: true });
};

export const deleteNotification = async (id: string) => {
  return await Notification.findByIdAndDelete(id);
};

export const listNotifications = async (
  query: z.infer<typeof listNotificationsQuerySchema>,
) => {
  const {
    userId,
    type,
    read,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  const filter: Record<string, any> = {};
  if (userId) filter.userId = new Types.ObjectId(userId);
  if (type) filter.type = type;
  if (typeof read === 'boolean') filter.read = read;

  const notifications = await Notification.find(filter)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Notification.countDocuments(filter);

  return { notifications, total };
};
