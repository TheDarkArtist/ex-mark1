import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  product_id: mongoose.Types.ObjectId;
  name: string;
  sku?: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface IShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IOrder extends Document {
  user_id: mongoose.Types.ObjectId;
  products: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: IShippingAddress;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema<IOrderItem> = new Schema(
  {
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    sku: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    image: { type: String },
  },
  { _id: false }
);

const ShippingAddressSchema: Schema<IShippingAddress> = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema: Schema<IOrder> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      required: true,
    },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      required: true,
    },
    paymentMethod: { type: String },
    transactionId: { type: String },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;


