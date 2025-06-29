import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request';
import { createProductSchema, productParamsSchema } from './products.schema';
import { ProductController } from './products.controller';
import { authenticateUser } from '../../../middlewares/authenticate-user';
import { authorizeAdmin } from '../../../middlewares/authorize-admin';

const router = Router();
const productController = new ProductController();

router.post(
  '/',
  authenticateUser,
  authorizeAdmin,
  validateRequest({ body: createProductSchema }),
  productController.createProduct
);

router.put(
  '/:id',
  authenticateUser,
  authorizeAdmin,
  validateRequest({ params: productParamsSchema, body: createProductSchema.partial() }),
  productController.updateProduct
);

router.delete(
  '/:id',
  authenticateUser,
  authorizeAdmin,
  validateRequest({ params: productParamsSchema }),
  productController.deleteProduct
);

router.get('/:id', validateRequest({ params: productParamsSchema }), productController.getProductById);
router.get('/', productController.listProducts);

export default router;

