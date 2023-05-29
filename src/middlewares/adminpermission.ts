import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import HttpException from "../utils/exception/exception";
import {validateToken} from "../utils/validate";
import UserModel from "../models/users/model";
import { ITokenObject } from "../utils/interfaces";

async function adminPermissionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  // const bearer = req.headers.authorization;

  // if (!bearer || !bearer.startsWith("Bearer ")) {
  //   return next(new HttpException(401, "Unauthorised"));
  // }

  // const accessToken = bearer.split("Bearer ")[1].trim();

  // if (!accessToken) {
  //   return next(new HttpException(401, "Unauthorised"));
  // }

  // try {
  //   const payload: ITokenObject | jwt.JsonWebTokenError =
  //   await validateToken.validateAccessToken(accessToken);

  //   if (payload instanceof jwt.JsonWebTokenError) {
  //     return next(new HttpException(401, "Unauthorised"));
  //   }

  //   const account = await UserModel.findById(payload.id).exec();

  //   if (!account) {
  //     return next(new HttpException(401, "Unauthorised"));
  //   } else if (account.role !== "Admin" && account.role !== "Moderator") {
  //     return next(new HttpException(401, "Access is denied"));
  //   }

  //   return next();
  // } catch (error) {
  //   return next(new HttpException(401, "Unauthorised"));
  // }
}

export default adminPermissionMiddleware;