import { Types } from 'mongoose';
import { ProductModel, type IProduct } from './products.model';

interface ProductFilters {
  category_id?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class ProductService {
  async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    const product = new ProductModel(data);
    return product.save();
  }

  async getProductById(id: string): Promise<IProduct | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return ProductModel.findById(id).exec();
  }

  async updateProduct(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return ProductModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteProduct(id: string): Promise<IProduct | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return ProductModel.findByIdAndDelete(id).exec();
  }

  async listProducts(
    filters: ProductFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<{ products: IProduct[]; total: number }> {
    const query: any = {};

    if (filters.category_id && Types.ObjectId.isValid(filters.category_id)) {
      query.category_id = filters.category_id;
    }

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      query.price = {};
      if (filters.priceMin !== undefined) query.price.$gte = filters.priceMin;
      if (filters.priceMax !== undefined) query.price.$lte = filters.priceMax;
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const page = pagination.page && pagination.page > 0 ? pagination.page : 1;
    const limit = pagination.limit && pagination.limit > 0 ? pagination.limit : 10;
    const skip = (page - 1) * limit;

    const sortField = pagination.sortBy || 'createdAt';
    const sortOrder = pagination.sortOrder === 'desc' ? -1 : 1;

    const [products, total] = await Promise.all([
      ProductModel.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      ProductModel.countDocuments(query).exec(),
    ]);

    return { products, total };
  }
}
