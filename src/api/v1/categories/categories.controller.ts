import type { Request, Response, NextFunction } from 'express';
import { CategoryService } from './categories.service';

interface ListCategoriesFilters {
  parentCategory?: string | null;
}

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdCategory = await this.categoryService.createCategory(
        req.body,
      );
      res.status(201).json(createdCategory);
    } catch (error) {
      next(error);
    }
  };

  getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.getCategoryById(
        req.params.id,
      );
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedCategory = await this.categoryService.updateCategory(
        req.params.id,
        req.body,
      );
      if (!updatedCategory) {
        res.status(404).json({ message: 'Category not found' });
      }
      res.json(updatedCategory);
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.categoryService.deleteCategory(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  listCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters: ListCategoriesFilters = {
        parentCategory:
          req.query.parentCategory === 'null'
            ? null
            : (req.query.parentCategory as string | undefined),
      };

      const pagination: PaginationOptions = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        sortBy:
          typeof req.query.sortBy === 'string' ? req.query.sortBy : 'createdAt',
        sortOrder: req.query.sortOrder === 'asc' ? 'asc' : 'desc',
      };

      const { categories, total } = await this.categoryService.listCategories(
        filters,
        pagination,
      );

      res.json({
        data: categories,
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
