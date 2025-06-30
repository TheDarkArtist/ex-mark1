import type { Request, Response, NextFunction } from 'express';
import { PaymentService } from './payment.service';
import { AuthorizationError, NotFoundError } from '../../../utils/app-error';

export class PaymentController {
  private paymentService = new PaymentService();


  createPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AuthorizationError("Unauthorized")
      }

      const { orderId, amount, currency } = req.body;

      const { payment, clientSecret } = await this.paymentService.createPayment(
        userId,
        orderId,
        amount,
        currency
      );

      res.status(201).json({ payment, clientSecret });
    } catch (error) {
      next(error);
    }
  };

  getPaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentId = req.params.paymentId;
      const payment = await this.paymentService.getPaymentById(paymentId);
      if (!payment) throw new NotFoundError("Payment not found")

      res.json(payment);
    } catch (error) {
      next(error);
    }
  };
}

