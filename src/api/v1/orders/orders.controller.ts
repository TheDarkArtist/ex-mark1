import type { Request, Response, NextFunction } from 'express';
import { OrderService } from './orders.service';
import { BadRequestError } from '../../../utils/app-error';

interface ListOrdersFilters {
  user_id?: string;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
}

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}


export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  private validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
  private validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'] as const;

  private isValidStatus(status: any): status is typeof this.validStatuses[number] {
    return this.validStatuses.includes(status);
  }

  private isValidPaymentStatus(status: any): status is typeof this.validPaymentStatuses[number] {
    return this.validPaymentStatuses.includes(status);
  }

  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderData = req.body;
      const createdOrder = await this.orderService.createOrder(orderData);
      res.status(201).json(createdOrder);
    } catch (error) {
      next(error);
    }
  };

  getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.params.id;
      const order = await this.orderService.getOrderById(orderId);
      if (!order) {
        throw new BadRequestError('Order not found');
      }
      res.json(order);
    } catch (error) {
      next(error);
    }
  };

  updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.params.id;
      const updateData = req.body;
      const updatedOrder = await this.orderService.updateOrder(orderId, updateData);
      res.json(updatedOrder);
    } catch (error) {
      next(error);
    }
  };

  deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.params.id;
      await this.orderService.deleteOrder(orderId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  listOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const statusRaw = req.query.status;
      const status =
        typeof statusRaw === 'string' && this.isValidStatus(statusRaw)
          ? statusRaw
          : undefined;

      const paymentStatusRaw = req.query.paymentStatus;
      const paymentStatus =
        typeof paymentStatusRaw === 'string' && this.isValidPaymentStatus(paymentStatusRaw)
          ? paymentStatusRaw
          : undefined;

      const filters: ListOrdersFilters = {
        user_id: typeof req.query.user_id === 'string' ? req.query.user_id : undefined,
        status,
        paymentStatus,
      };

      const sortOrderRaw = req.query.sortOrder;
      const sortOrder: 'asc' | 'desc' = sortOrderRaw === 'asc' ? 'asc' : 'desc';

      const pagination: PaginationOptions = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        sortBy: (typeof req.query.sortBy === 'string' ? req.query.sortBy : 'createdAt'),
        sortOrder,
      };

      const { orders, total } = await this.orderService.listOrders(filters, pagination);

      res.json({
        data: orders,
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

