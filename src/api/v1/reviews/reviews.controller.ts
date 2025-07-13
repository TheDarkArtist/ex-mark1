import type { Request, Response, NextFunction } from 'express';
import { ReviewService } from './reviews.service';
import { NotFoundError } from '../../../utils/app-error';

interface ListReviewsFilters {
  user_id?: string;
  product_id?: string;
}

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviewData = { ...req.body, user_id: req.user?.id };
      const createdReview = await this.reviewService.createReview(reviewData);
      res.status(201).json(createdReview);
    } catch (error) {
      next(error);
    }
  };

  getReviewById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review = await this.reviewService.getReviewById(req.params.id);
      if (!review) {
        throw new NotFoundError('Review not found');
      }
      res.json(review);
    } catch (error) {
      next(error);
    }
  };

  updateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedReview = await this.reviewService.updateReview(
        req.params.id,
        req.body,
      );
      if (!updatedReview) {
        throw new NotFoundError('Review not found');
      }
      res.json(updatedReview);
    } catch (error) {
      next(error);
    }
  };

  deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.reviewService.deleteReview(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  listReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters: ListReviewsFilters = {
        user_id:
          typeof req.query.user_id === 'string' ? req.query.user_id : undefined,
        product_id:
          typeof req.query.product_id === 'string'
            ? req.query.product_id
            : undefined,
      };

      const sortOrderRaw = req.query.sortOrder;
      const sortOrder: 'asc' | 'desc' = sortOrderRaw === 'asc' ? 'asc' : 'desc';

      const pagination: PaginationOptions = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        sortBy:
          typeof req.query.sortBy === 'string' ? req.query.sortBy : 'createdAt',
        sortOrder,
      };

      const { reviews, total } = await this.reviewService.listReviews(
        filters,
        pagination,
      );

      res.json({
        data: reviews,
        meta: {
          total,
          page: pagination.page,
          limit: pagination.limit,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
