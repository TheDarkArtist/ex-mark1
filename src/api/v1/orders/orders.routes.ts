import { Router } from 'express';
import { OrderController } from './orders.controller';
import { validateRequest } from '../../../middlewares/validate-request';
import {
  createOrderSchema,
  updateOrderSchema,
  orderParamsSchema,
  listOrdersQuerySchema,
} from './orders.schema';
import { authenticateUser } from '../../../middlewares/authenticate-user';
import { authorizeAdmin } from '../../../middlewares/authorize-admin';

const router = Router();
const orderController = new OrderController();

router.use(authenticateUser);

router.post('/', validateRequest({ body: createOrderSchema }), orderController.createOrder);

router.get('/', validateRequest({ query: listOrdersQuerySchema }), orderController.listOrders);

router.get('/:id', validateRequest({ params: orderParamsSchema }), orderController.getOrderById);

router.put(
  '/:id',
  validateRequest({ params: orderParamsSchema, body: updateOrderSchema }),
  orderController.updateOrder
);

router.delete('/:id', validateRequest({ params: orderParamsSchema }), authorizeAdmin, orderController.deleteOrder);

export default router;

