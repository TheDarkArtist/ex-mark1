import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { authenticateUser } from '../../../middlewares/authenticate-user';
import { validateRequest } from '../../../middlewares/validate-request';
import { createPaymentSchema, paymentIdParamsSchema } from './payment.schema';
import webhookRouter from "./payment.webhook"

const paymentController = new PaymentController();
const router = Router();

router.post(
  '/',
  authenticateUser,
  validateRequest({ body: createPaymentSchema }),
  paymentController.createPayment
);

router.get(
  '/:paymentId',
  authenticateUser,
  validateRequest({ params: paymentIdParamsSchema }),
  paymentController.getPaymentStatus
);

router.post('/webhook', webhookRouter);

export default router;

