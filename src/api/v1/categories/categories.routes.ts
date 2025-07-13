import { Router } from 'express';
import { CategoryController } from './categories.controller';
import { validateRequest } from '../../../middlewares/validate-request';
import { authenticateUser } from '../../../middlewares/authenticate-user';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryParamsSchema,
  listCategoriesQuerySchema,
} from './categories.schema';

const router = Router();
const categoryController = new CategoryController();

router.post(
  '/',
  authenticateUser,
  validateRequest({ body: createCategorySchema }),
  categoryController.createCategory,
);

router.get(
  '/',
  validateRequest({ query: listCategoriesQuerySchema }),
  categoryController.listCategories,
);

router.get(
  '/:id',
  validateRequest({ params: categoryParamsSchema }),
  categoryController.getCategoryById,
);

router.put(
  '/:id',
  authenticateUser,
  validateRequest({ params: categoryParamsSchema, body: updateCategorySchema }),
  categoryController.updateCategory,
);

router.delete(
  '/:id',
  authenticateUser,
  validateRequest({ params: categoryParamsSchema }),
  categoryController.deleteCategory,
);

export default router;
