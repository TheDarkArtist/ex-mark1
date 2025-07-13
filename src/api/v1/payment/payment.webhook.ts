import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import Stripe from 'stripe';
import { BadRequestError } from '../../../utils/app-error';
import { PaymentService } from './payment.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const paymentService = new PaymentService();

const router = express.Router();

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response, next: NextFunction) => {
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return next(new BadRequestError('Invalid webhook signature'));
    }

    try {
      switch (event.type) {
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await paymentService.updatePaymentStatus(
            paymentIntent.id,
            'completed',
          );
          break;
        }
        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await paymentService.updatePaymentStatus(paymentIntent.id, 'failed');
          break;
        }
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (err) {
      console.error('Error processing webhook event:', err);
      return next(new BadRequestError('Failed to process webhook event', err));
    }
  },
);

export default router;
