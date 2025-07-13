import { Router } from 'express';
import { NotificationController } from './notifications.controller';
import { validateRequest } from '../../../middlewares/validate-request';
import { authenticateUser } from '../../../middlewares/authenticate-user';
import { authorizeAdmin } from '../../../middlewares/authorize-admin';
import {
  createNotificationSchema,
  updateNotificationSchema,
  notificationParamsSchema,
  listNotificationsQuerySchema,
} from './notifications.schema';

const router = Router();
const controller = new NotificationController();

router.post(
  '/',
  authenticateUser,
  authorizeAdmin,
  validateRequest({ body: createNotificationSchema }),
  controller.createNotification,
);

router.put(
  '/:id',
  authenticateUser,
  validateRequest({
    params: notificationParamsSchema,
    body: updateNotificationSchema,
  }),
  controller.updateNotification,
);

router.delete(
  '/:id',
  authenticateUser,
  authorizeAdmin,
  validateRequest({ params: notificationParamsSchema }),
  controller.deleteNotification,
);

router.get(
  '/:id',
  authenticateUser,
  validateRequest({ params: notificationParamsSchema }),
  controller.getNotificationById,
);

router.get(
  '/',
  authenticateUser,
  validateRequest({ query: listNotificationsQuerySchema }),
  controller.listNotifications,
);

export default router;
