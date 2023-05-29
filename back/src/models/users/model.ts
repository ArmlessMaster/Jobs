import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

import IUser from "./interface";
import TokenModel from "../tokens/model"
import JobModel from "../jobs/model"
import generatePasswordHash from "../../utils/hashPassword/generatePasswordHash";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Invalid email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
    },
    paymentKeys: {
      type: Array<string>,
      default: [],
    },
    allPaymentKeys: {
      type: Array<string>,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const hash = await generatePasswordHash(this.password);

  this.password = hash;

  next();
});

UserSchema.pre<IUser>("findOneAndUpdate", async function (this) {
  const update: any = { ...this.getUpdate() };

  if (update.password) {
    update.password = await generatePasswordHash(update.password);
    this.setUpdate(update);
  }
});

UserSchema.methods.isValidPassword = async function (
  password: string
): Promise<Error | boolean> {
  return await bcrypt.compare(password, this.password);
};

UserSchema.post('findOneAndDelete', async function (result, next) {
  await TokenModel.deleteMany({ user_id: result._id });
  await JobModel.deleteMany({ account_id: result._id });
  next();
});

export default model<IUser>("Users", UserSchema);