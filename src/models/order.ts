import mongoose, { Schema } from "mongoose";
import { Model, Document } from "mongoose";
import { Product } from "./product";

export interface IOrder extends Document {
  _id: string;
  orderId?: string;
  orderDate?: Date;
  customerId?: string;
  orderAmount?: number;
  discountAmount?: number;
  taxAmount?: number;
  netAmount?: number;
  orderStatus?:string;
  orderItems?: IOrderItemsBase[];
}

export interface ICustomerOrder extends Document {
  _id?: string;
  productId: string;
  qty: number;
}

export interface IOrderItemsBase extends Document {
  productId?: any;
  rate?: number;
  qty?: number;
  price?: number;
  taxPer?: number;
  taxAmount?: number;
  netAmount?: number;
}

const OrderSchema = new mongoose.Schema(
  {
    orderNo: {
      type: String,
      unique: true,
      required: false,
      trim: true,
    },
    orderDate: {
      type: Number,
      required: false,
      default: Date.now,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      required: false,
      default: null,
    },
    orderAmount: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    netAmount: {
      type: Number,
      default: 0,
    },
    orderStatus: {
      type: String,
      required: false,
      enum: ["PROCESSING","COMPLETED"],
      default: 'PROCESSING',
    },
    orderItems: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: false,
          default: null,
          ref: Product,
        },
        price: {
          type: Number,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        rate: {
          type: Number,
          required: true,
        },
        taxPer: {
          type: Number,
          required: false,
          default: 0,
        },
        taxAmount: {
          type: Number,
          required: false,
          default: 0,
        },
        netAmount: {
          type: Number,
          required: false,
          default: 0,
        },
        
      },
    ],
  },
  { versionKey: false }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
