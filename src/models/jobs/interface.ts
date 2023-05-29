import { Schema, Document } from "mongoose";

import IUser from "../users/interface";

export default interface IJob extends Document {
  user_id: Schema.Types.ObjectId | IUser;
  title: string;
  company: string;
  type: string;
  location: Array<string>;
  priceFrom: number;
  priceTo: number;
  link: string;
  isActive: boolean;
  experience: Array<string>;
  about: string;
  validityDate: Date;
  isTop: boolean;
  topValidityDate: Date;
  imagesUrls: Array<string>;

  isValid(): Promise<Error | void>;
  isValidTop(): Promise<Error | void>;
}