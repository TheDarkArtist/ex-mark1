import type { Request, Response, NextFunction } from 'express';
import * as NotificationService from './notifications.service';
import {
  createNotificationSchema,
  updateNotificationSchema,
  listNotificationsQuerySchema,
  notificationParamsSchema,
} from './notifications.schema';
import { NotFoundError, ValidationError } from '@/utils/app-error';

export class NotificationController {
  createNotification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = createNotificationSchema.parse(req.body);
      const notification = await NotificationService.createNotification(data);
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof Error && 'errors' in error) {
        next(new ValidationError('Invalid notification data', error));
      } else {
        next(error);
      }
    }
  };

  getNotificationById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = notificationParamsSchema.parse(req.params);
      const notification = await NotificationService.getNotificationById(id);
      if (!notification) throw new NotFoundError('Notification not found');
      res.json(notification);
    } catch (error) {
      next(error);
    }
  };

  updateNotification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = notificationParamsSchema.parse(req.params);
      const update = updateNotificationSchema.parse(req.body);
      const updated = await NotificationService.updateNotification(id, update);
      if (!updated) throw new NotFoundError('Notification not found');
      res.json(updated);
    } catch (error) {
      if (error instanceof Error && 'errors' in error) {
        next(new ValidationError('Invalid update data', error));
      } else {
        next(error);
      }
    }
  };

  deleteNotification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = notificationParamsSchema.parse(req.params);
      const deleted = await NotificationService.deleteNotification(id);
      if (!deleted) throw new NotFoundError('Notification not found');
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  listNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const query = listNotificationsQuerySchema.parse(req.query);
      const { notifications, total } =
        await NotificationService.listNotifications(query);
      res.json({
        data: notifications,
        meta: {
          total,
          page: query.page ?? 1,
          limit: query.limit ?? 10,
        },
      });
    } catch (error) {
      next(new ValidationError('Invalid query parameters', error));
    }
  };
}
