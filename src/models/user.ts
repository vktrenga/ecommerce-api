import mongoose from "mongoose";
import { Model, Document } from "mongoose";

export interface IUser extends Document {
  _id?: string | object;
  name: string;
  phoneNo: string;
  emailId: string;
  profileImage: string;
  isAdmin: boolean;
  isActive: boolean;
  password: string;
  salt: string;
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNo: {
      type: String,
      required: false,
      default: null,
      trim: true,
    },
    emailId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
      default: null,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      default: null,
    },
    salt: {
      type: String,
      default: null,
    },
  },
  { versionKey: false }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model("User", UserSchema);
