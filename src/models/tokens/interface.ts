import { Schema } from "mongoose";

interface IToken extends Object {
  user_id: Schema.Types.ObjectId;
  refreshToken: string;
}

export default IToken;