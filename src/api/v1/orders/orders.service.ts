import Order, { type IOrder } from './orders.model';
import { Types } from 'mongoose';
import { NotFoundError, BadRequestError } from '../../../utils/app-error';
import { ProductService } from '../products/products.service';

interface ListOrdersFilters {
  user_id?: string;
  status?: IOrder['status'];
  paymentStatus?: IOrder['paymentStatus'];
}

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export class OrderService {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async createOrder(orderData: Partial<IOrder>): Promise<IOrder> {
    if (!orderData.products || orderData.products.length === 0) {
      throw new BadRequestError('Order must contain at least one product');
    }

    let totalAmount = 0;
    for (const item of orderData.products) {
      if (!Types.ObjectId.isValid(item.product_id)) {
        throw new BadRequestError(`Invalid product ID: ${item.product_id}`);
      }

      const product = await this.productService.getProductById(
        item.product_id.toString(),
      );
      if (!product) {
        throw new BadRequestError(`Product not found: ${item.product_id}`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestError(
          `Insufficient stock for product ${product.name}`,
        );
      }

      totalAmount += product.price * item.quantity;

      item.name = product.name;
      item.price = product.price;
      item.sku = product.sku;
      item.image = product.images?.[0] || '';
    }

    if (!orderData.shippingAddress) {
      throw new BadRequestError('Shipping address is required');
    }

    const order = new Order({
      ...orderData,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
    });

    const savedOrder = await order.save();

    //TODO: Email notification

    return savedOrder;
  }

  async getOrderById(id: string): Promise<IOrder | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid order ID');
    }
    return await Order.findById(id).exec();
  }

  async updateOrder(
    id: string,
    updateData: Partial<IOrder>,
  ): Promise<IOrder | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid order ID');
    }
    const order = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
    }).exec();
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    return order;
  }

  async deleteOrder(id: string): Promise<IOrder | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid order ID');
    }
    const order = await Order.findByIdAndDelete(id).exec();
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    return order;
  }

  async listOrders(
    filters: ListOrdersFilters,
    pagination: PaginationOptions,
  ): Promise<{ orders: IOrder[]; total: number }> {
    const query: Record<string, any> = {};

    if (filters.user_id) {
      if (!Types.ObjectId.isValid(filters.user_id)) {
        throw new BadRequestError('Invalid user ID');
      }
      query.user_id = filters.user_id;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.paymentStatus) {
      query.paymentStatus = filters.paymentStatus;
    }

    const sort: Record<string, 1 | -1> = {};
    sort[pagination.sortBy] = pagination.sortOrder === 'asc' ? 1 : -1;

    const total = await Order.countDocuments(query).exec();

    const orders = await Order.find(query)
      .sort(sort)
      .skip((pagination.page - 1) * pagination.limit)
      .limit(pagination.limit)
      .exec();

    return { orders, total };
  }
}
