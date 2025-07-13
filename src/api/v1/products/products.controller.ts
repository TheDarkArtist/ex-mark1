import type { Request, Response, NextFunction } from 'express';
import { ProductService } from './products.service';

const productService = new ProductService();

export class ProductController {
  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productService.getProductById(req.params.id);
      product
        ? res.json(product)
        : res.status(404).json({ message: 'Product not found' });
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedProduct = await productService.updateProduct(
        req.params.id,
        req.body,
      );
      updatedProduct
        ? res.json(updatedProduct)
        : res.status(404).json({ message: 'Product not found' });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deletedProduct = await productService.deleteProduct(req.params.id);
      deletedProduct
        ? res.status(204).send()
        : res.status(404).json({ message: 'Product not found' });
    } catch (error) {
      next(error);
    }
  };

  listProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = {
        category_id: req.query.category_id as string,
        priceMin: req.query.priceMin ? Number(req.query.priceMin) : undefined,
        priceMax: req.query.priceMax ? Number(req.query.priceMax) : undefined,
        search: req.query.search as string | undefined,
      };

      const pagination = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        sortBy: (req.query.sortBy as string) || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const { products, total } = await productService.listProducts(
        filters,
        pagination,
      );

      res.json({
        data: products,
        meta: { total, page: pagination.page, limit: pagination.limit },
      });
    } catch (error) {
      next(error);
    }
  };
}
