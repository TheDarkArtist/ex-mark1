import { Types } from 'mongoose';
import Review, { type IReview } from './reviews.model';
import { BadRequestError } from '../../../utils/app-error';

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

export class ReviewService {
  async createReview(data: Partial<IReview>): Promise<IReview> {
    if (!data.user_id || !Types.ObjectId.isValid(data.user_id)) {
      throw new BadRequestError('Invalid or missing user ID');
    }
    if (!data.product_id || !Types.ObjectId.isValid(data.product_id)) {
      throw new BadRequestError('Invalid or missing product ID');
    }
    const review = new Review(data);
    return review.save();
  }

  async getReviewById(id: string): Promise<IReview | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid review ID');
    }
    return Review.findById(id).exec();
  }

  async updateReview(id: string, data: Partial<IReview>): Promise<IReview | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid review ID');
    }
    return Review.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteReview(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid review ID');
    }
    const result = await Review.findByIdAndDelete(id).exec();
    if (!result) {
      throw new BadRequestError('Review not found');
    }
  }

  async listReviews(
    filters: ListReviewsFilters,
    pagination: PaginationOptions
  ): Promise<{ reviews: IReview[]; total: number }> {
    const query: Record<string, any> = {};

    if (filters.user_id) {
      if (!Types.ObjectId.isValid(filters.user_id)) {
        throw new BadRequestError('Invalid user ID');
      }
      query.user_id = filters.user_id;
    }

    if (filters.product_id) {
      if (!Types.ObjectId.isValid(filters.product_id)) {
        throw new BadRequestError('Invalid product ID');
      }
      query.product_id = filters.product_id;
    }

    const sort: Record<string, 1 | -1> = {};
    sort[pagination.sortBy] = pagination.sortOrder === 'asc' ? 1 : -1;

    const total = await Review.countDocuments(query).exec();

    const reviews = await Review.find(query)
      .sort(sort)
      .skip((pagination.page - 1) * pagination.limit)
      .limit(pagination.limit)
      .exec();

    return { reviews, total };
  }
}

