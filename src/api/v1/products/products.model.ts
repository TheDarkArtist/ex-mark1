import { Schema, model, Types, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  category_id: Types.ObjectId;
  images: string[];
  brand?: string;
  weight?: number;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    images: { type: [String], default: [] },
    brand: { type: String },
    weight: { type: Number },
    dimensions: {
      width: { type: Number },
      height: { type: Number },
      depth: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

export const ProductModel = model<IProduct>('Product', productSchema);

