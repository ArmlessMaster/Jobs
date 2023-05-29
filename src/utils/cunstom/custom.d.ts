import IUser from "../../models/users/interface";

declare global {
  namespace Express {
    export interface Request {
      user: IUser;
    }
  }
}