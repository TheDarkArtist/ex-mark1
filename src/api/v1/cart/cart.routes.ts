import { Router } from 'express';
import { CartController } from './cart.controller';
import { authenticateUser } from '../../../middlewares/authenticate-user';
import { validateRequest } from '../../../middlewares/validate-request';
import {
  cartItemSchema,
  cartParamsSchema,
} from './cart.schema';

const router = Router();
const cartController = new CartController();

router.get(
  '/',
  authenticateUser,
  cartController.getCart
);

// Add item to cart
router.post(
  '/',
  authenticateUser,
  validateRequest({ body: cartItemSchema }),
  cartController.addItem
);

// Update an item in the cart
router.put(
  '/:productId',
  authenticateUser,
  validateRequest({ params: cartParamsSchema, body: cartItemSchema.partial() }),
  cartController.updateItem
);

// Remove an item from the cart
router.delete(
  '/:productId',
  authenticateUser,
  validateRequest({ params: cartParamsSchema }),
  cartController.removeItem
);

// Clear the cart
router.delete(
  '/',
  authenticateUser,
  cartController.clearCart
);

export default router;

