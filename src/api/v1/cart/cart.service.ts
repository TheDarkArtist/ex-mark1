import mongoose, { Types } from 'mongoose';
import Cart, { type ICart } from './cart.model';
import { BadRequestError, NotFoundError } from '../../../utils/app-error';
import { ProductModel } from '../products/products.model';

export class CartService {
  // Get cart by user ID, or create a new one if not exists
  async getCartByUserId(userId: string): Promise<ICart> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Invalid user ID');
    }

    let cart = await Cart.findOne({ user: userId })
      .populate('items.product')
      .exec();

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
    }

    return cart;
  }

  // Add or update an item in the user's cart
  async addItemToCart(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<ICart> {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestError('Invalid product ID');
    }
    if (quantity < 1) {
      throw new BadRequestError('Quantity must be at least 1');
    }

    // Fetch product price from DB (price snapshot)
    const product = await ProductModel.findById(productId)
      .select('price')
      .exec();
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const priceAtAddition = product.price;

    const cart = await this.getCartByUserId(userId);

    const existingItemIndex = cart.items.findIndex(
      (ci) => ci.product.toString() === productId,
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].priceAtAddition = priceAtAddition;
    } else {
      cart.items.push({
        product: new mongoose.Types.ObjectId(productId),
        quantity,
        priceAtAddition,
      });
    }

    await cart.save();
    return cart.populate('items.product');
  }

  // Update quantity or price of a specific item in cart
  async updateCartItem(
    userId: string,
    productId: string,
    updates: { quantity?: number; priceAtAddition?: number },
  ): Promise<ICart> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(productId)) {
      throw new BadRequestError('Invalid user or product ID');
    }

    const cart = await this.getCartByUserId(userId);

    const item = cart.items.find((ci) => ci.product.toString() === productId);
    if (!item) {
      throw new NotFoundError('Product not found in cart');
    }

    if (updates.quantity !== undefined) {
      if (updates.quantity < 1)
        throw new BadRequestError('Quantity must be at least 1');
      item.quantity = updates.quantity;
    }

    if (updates.priceAtAddition !== undefined) {
      if (updates.priceAtAddition < 0)
        throw new BadRequestError('Price must be non-negative');
      item.priceAtAddition = updates.priceAtAddition;
    }

    await cart.save();
    return cart.populate('items.product');
  }

  // Remove an item from the cart
  async removeItemFromCart(userId: string, productId: string): Promise<ICart> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(productId)) {
      throw new BadRequestError('Invalid user or product ID');
    }

    const cart = await this.getCartByUserId(userId);

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((ci) => ci.product.toString() !== productId);

    if (cart.items.length === initialLength) {
      throw new NotFoundError('Product not found in cart');
    }

    await cart.save();
    return cart.populate('items.product');
  }

  // Clear all items from the cart
  async clearCart(userId: string): Promise<ICart> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Invalid user ID');
    }

    const cart = await this.getCartByUserId(userId);
    cart.items = [];
    await cart.save();
    return cart;
  }
}
