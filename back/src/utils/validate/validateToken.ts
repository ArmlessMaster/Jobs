import jwt from "jsonwebtoken";

import { ITokenObject } from "../interfaces";

export const validateAccessToken = async (
  accessToken: string): 
  Promise<jwt.VerifyErrors | ITokenObject> => {
    try {
      return new Promise((resolve, reject) => {
        jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as jwt.Secret, (err, payload) => {
          if (err) {
            return reject(err);
          }
          resolve(payload as ITokenObject);
        });
      });
    } catch (error) {
      throw new Error("Unable to valid token");
    }
};

export const validateRefreshToken = async (
  refreshToken: string
): Promise<jwt.VerifyErrors | ITokenObject> => {
  try {
    return new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as jwt.Secret,
        (err, payload) => {
          if (err) {
            return reject(err);
          }
          resolve(payload as ITokenObject);
        }
      );
    });
  } catch (error) {
    throw new Error("Unable to valid token");
  }
};

export default { validateAccessToken, validateRefreshToken };