import { Schema, model } from "mongoose";
import IToken from "./interface";

const TokenSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      default: false,
      ref: "Users"
    },
    refreshToken: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

export default model<IToken>("Tokens", TokenSchema);