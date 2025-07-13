import { Router } from 'express';
import { ReviewController } from './reviews.controller';
import { validateRequest } from '../../../middlewares/validate-request';
import { authenticateUser } from '../../../middlewares/authenticate-user';
import {
  createReviewSchema,
  updateReviewSchema,
  reviewParamsSchema,
  listReviewsQuerySchema,
} from './reviews.schema';

const router = Router();
const reviewController = new ReviewController();

router.post(
  '/',
  authenticateUser,
  validateRequest({ body: createReviewSchema }),
  reviewController.createReview,
);

router.get(
  '/',
  validateRequest({ query: listReviewsQuerySchema }),
  reviewController.listReviews,
);

router.get(
  '/:id',
  validateRequest({ params: reviewParamsSchema }),
  reviewController.getReviewById,
);

router.put(
  '/:id',
  authenticateUser,
  validateRequest({ params: reviewParamsSchema }),
  validateRequest({ body: updateReviewSchema }),
  reviewController.updateReview,
);

router.delete(
  '/:id',
  authenticateUser,
  validateRequest({ params: reviewParamsSchema }),
  reviewController.deleteReview,
);

export default router;
