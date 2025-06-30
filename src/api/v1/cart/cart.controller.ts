import type { Request, Response, NextFunction } from 'express';
import { CartService } from './cart.service';
import { AuthorizationError } from '../../../utils/app-error';

export class CartController {
  private cartService = new CartService();

  private getUserId(req: Request): string | null {
    if (!req.user || !req.user.id) {
      return null;
    }
    return req.user.id;
  }

  getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        throw new AuthorizationError("Unauthorized")
      }
      const cart = await this.cartService.getCartByUserId(userId);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  };

  addItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        throw new AuthorizationError("Unauthorized")
      }

      const { product, quantity, priceAtAddition } = req.body;
      const updatedCart = await this.cartService.addItemToCart(userId, { product, quantity, priceAtAddition });
      res.status(201).json(updatedCart);
    } catch (error) {
      next(error);
    }
  };

  updateItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        throw new AuthorizationError("Unauthorized")
      }

      const productId = req.params.productId;
      const updates = req.body;
      const updatedCart = await this.cartService.updateCartItem(userId, productId, updates);
      res.json(updatedCart);
    } catch (error) {
      next(error);
    }
  };

  removeItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        throw new AuthorizationError("Unauthorized")
      }

      const productId = req.params.productId;
      const updatedCart = await this.cartService.removeItemFromCart(userId, productId);
      res.json(updatedCart);
    } catch (error) {
      next(error);
    }
  };

  clearCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        throw new AuthorizationError("Unauthorized")
      }

      const clearedCart = await this.cartService.clearCart(userId);
      res.json(clearedCart);
    } catch (error) {
      next(error);
    }
  };
}

