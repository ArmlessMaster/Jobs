import { Document } from "mongoose";

export default interface IUser extends Document {
  email: string;
  password: string;
  paymentKeys: Array<string>;
  allPaymentKeys: Array<string>;
  
  getUpdate(): Promise<Error | Object>;
  setUpdate(obj: Object): Promise<Error | boolean>;
  isValidPassword(passwod: string): Promise<Error | boolean>;
}