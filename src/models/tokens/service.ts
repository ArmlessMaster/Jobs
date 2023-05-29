import { Schema } from "mongoose";
import jwt from "jsonwebtoken";

import TokenModel from "./model";
import IUser from "../users/interface";

class TokenService {
  private token = TokenModel;

  public async generateTokens(user: IUser): Promise<object | Error> {
    try {
      const accessToken = jwt.sign(
        {id: user._id},
        process.env.JWT_ACCESS_SECRET as jwt.Secret,
        { expiresIn: "1d" }
      );
      const refreshToken = jwt.sign(
        {id: user._id},
        process.env.JWT_REFRESH_SECRET as jwt.Secret,
        { expiresIn: "30d" }
      ); 

      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error("Unable to create token");
    }
  }

  public async saveToken(
    user_id: Schema.Types.ObjectId,
    refreshToken: string
  ): Promise<object | Error> {
    try {
      const tokenData = await this.token.findOne({ user_id: user_id });

      if (tokenData) {
        tokenData.refreshToken = refreshToken;
        tokenData.user_id = user_id;
        return tokenData.save();
      }

      const token = await this.token.create({ user_id, refreshToken });

      return token;
    } catch (error) {
      throw new Error("Unable to save token");
    }
  }

  public async removeToken(refreshToken: string): Promise<object | Error> {
    try {
      const tokenData = await this.token.deleteOne({ refreshToken });

      return tokenData;
    } catch (error) {
      throw new Error("Unable to remove token");
    }
  }

  public async findToken(refreshToken: string): Promise<object | null | Error> {
    try {
      const tokenData = await this.token.findOne({ refreshToken });

      return tokenData;
    } catch (error) {
      throw new Error("Unable to find token");
    }
  }
}

export default TokenService;