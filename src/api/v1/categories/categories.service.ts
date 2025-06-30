import { Types } from 'mongoose';
import { BadRequestError } from '../../../utils/app-error';
import Category, { type ICategory } from './categories.model';

interface ListCategoriesFilters {
  parentCategory?: string | null;
}

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export class CategoryService {
  async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    if (data.parentCategory && !Types.ObjectId.isValid(data.parentCategory)) {
      throw new BadRequestError('Invalid parentCategory ID');
    }
    const category = new Category(data);
    return category.save();
  }

  async getCategoryById(id: string): Promise<ICategory | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid category ID');
    }
    return Category.findById(id).exec();
  }

  async updateCategory(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid category ID');
    }
    if (data.parentCategory && !Types.ObjectId.isValid(data.parentCategory)) {
      throw new BadRequestError('Invalid parentCategory ID');
    }
    return Category.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteCategory(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid category ID');
    }
    const result = await Category.findByIdAndDelete(id).exec();
    if (!result) {
      throw new BadRequestError('Category not found');
    }
  }

  async listCategories(
    filters: ListCategoriesFilters,
    pagination: PaginationOptions
  ): Promise<{ categories: ICategory[]; total: number }> {
    const query: any = {};

    if (filters.parentCategory === null) {
      // To get root categories with no parent
      query.parentCategory = { $exists: false };
    } else if (filters.parentCategory) {
      if (!Types.ObjectId.isValid(filters.parentCategory)) {
        throw new BadRequestError('Invalid parentCategory ID');
      }
      query.parentCategory = filters.parentCategory;
    }

    const sort: any = {};
    sort[pagination.sortBy] = pagination.sortOrder === 'asc' ? 1 : -1;

    const total = await Category.countDocuments(query).exec();

    const categories = await Category.find(query)
      .sort(sort)
      .skip((pagination.page - 1) * pagination.limit)
      .limit(pagination.limit)
      .exec();

    return { categories, total };
  }
}

