import mongoose, { Schema } from "mongoose";
import { Model, Document } from "mongoose";
import { User } from "./user";

export interface IProduct extends Document {
  _id?: string;
  name: string;
  code: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  isActive: boolean;
  updatedBy: object;
  createdBy: object;
}

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: false,
      default: null,
      ref: User,
    },
    createdAt: {
      type: Date,
      required: false,
      default: Date.now,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      required: false,
      default: null,
      ref: User,
    },
    updatedAt: {
      type: Date,
      required: false,
      default: Date.now,
    },
  },
  { versionKey: false }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
