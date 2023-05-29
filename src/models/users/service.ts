import { Schema } from "mongoose";
import jwt from "jsonwebtoken";

import UserModel from "./model";
import IUser from "./interface";
import Props from "../../utils/props/props";
import TokenService from "../tokens/service";
import TokenModel from "../tokens/model";
import { ITokenObject } from "../../utils/interfaces";
import { validateToken } from "../../utils/validate";
import { generateRandomString } from "../../utils/functions/functions";

const stripe = require("stripe")(process.env.STRIPE_KEY);

class UserService {
  private user = UserModel;
  private token = TokenModel;
  private tokenService = new TokenService();

  private async saveToken(tokens: Props, user: IUser): Promise<any> {
    try {
      tokens
        .then(async (data: Props) => {
          await this.tokenService.saveToken(user.id, data.refreshToken);
        })
        .catch((error: any) => {
          throw new Error("Unforeseeable error");
        });
    } catch (error) {
      throw new Error("Unable to find users");
    }
  }

  public async login(email: string, password: string): Promise<object | Error> {
    try {
      const user = await this.user.findOne({ email });
      if (!user) {
        throw new Error("Unable to find user account with that email address");
      }

      await this.user
        .findOneAndUpdate(
          { email: email },
          {
            allPaymentKeys: [],
          },
          { new: true }
        )
        .exec();

      if (await user.isValidPassword(password)) {
        const tokens = this.tokenService.generateTokens(user);

        this.saveToken(tokens, user);

        return tokens;
      } else {
        throw new Error("Wrong credentials given");
      }
    } catch (error: any) {
      throw new Error("Unable to login user account");
    }
  }

  public async register(
    email: string,
    password: string
  ): Promise<object | Error> {
    try {
      const userExists = await this.user.findOne({ email });

      if (userExists) {
        throw new Error("User account already exists");
      }

      const user = await this.user.create({
        email,
        password,
      });

      const tokens = this.tokenService.generateTokens(user);

      this.saveToken(tokens, user);

      return tokens;
    } catch (error: any) {
      throw new Error("Unable to create user account");
    }
  }

  public async logout(refreshToken: string): Promise<object | Error> {
    try {
      const token = this.tokenService.removeToken(refreshToken);

      return token;
    } catch (error: any) {
      throw new Error("Unable to delete user token");
    }
  }

  public async refresh(refreshToken: string): Promise<object | Error> {
    try {
      if (!refreshToken) {
        throw new Error("User is not logged in");
      }

      const userData: ITokenObject | jwt.JsonWebTokenError =
        await validateToken.validateRefreshToken(refreshToken);
      const tokenFromDB = await this.tokenService.findToken(refreshToken);

      if (!userData || !tokenFromDB) {
        throw new Error("User is not logged in");
      }

      const token = await this.token.findOne({ refreshToken });

      if (!token) {
        throw new Error("User is not logged in");
      }

      const user = await this.user.findById(token.user_id);

      if (!user) {
        throw new Error("User is not logged in");
      }

      const tokens = this.tokenService.generateTokens(user);

      this.saveToken(tokens, user);

      return tokens;
    } catch (error: any) {
      throw new Error("Unable to refresh user token");
    }
  }

  public async updatePassword(
    _id: Schema.Types.ObjectId,
    new_password: string,
    password: string
  ): Promise<IUser | Error> {
    try {
      const account = await this.user.findOne({ _id });

      if (!account) {
        throw new Error("Unable to find account with that id");
      }

      if (await account.isValidPassword(password)) {
        const user = await this.user.findByIdAndUpdate(
          _id,
          { password: new_password },
          { new: true }
        );

        if (!user) {
          throw new Error("Unable to update user account with that id");
        }

        return user;
      } else {
        throw new Error("Wrong credentials given");
      }
    } catch (error) {
      throw new Error("The old password does not match the entered one");
    }
  }

  public async payment(
    user: IUser,
    days: number,
    price: number,
    oldPrice: number,
    my_domain: string,
    name: string
  ): Promise<string | Error> {
    try {
      const key = generateRandomString(100);

      await this.user.findOneAndUpdate(
        { _id: user._id },
        { $push: { allPaymentKeys: key } }
      );

      const line_items = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: name + " " + days + " " + "days",
              description: `Previous price: ${oldPrice.toFixed(
                2
              )}$, new price: ${price.toFixed(2)}$`,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ];
      const time = new Date().getTime();

      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${my_domain}/success/${key}/${time}/${days}`,
        cancel_url: `${my_domain}/canceled`,
      });

      return session.url;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async getAllUsers(): Promise<IUser | Array<IUser> | Error> {
    try {
      const user = await this.user.find({}).select(["-password"]);

      if (!user) {
        throw new Error("Unable to find users");
      }

      return user;
    } catch (error) {
      throw new Error("Unable to find users");
    }
  }

  public async getAllUsersWithoutAdmin(): Promise<
    IUser | Array<IUser> | Error
  > {
    try {
      const user = await this.user
        .find({ role: { $ne: "Admin" } })
        .select(["-password"]);

      if (!user) {
        throw new Error("Unable to find users");
      }

      return user;
    } catch (error) {
      throw new Error("Unable to find users");
    }
  }

  public async getUser(_id: Schema.Types.ObjectId): Promise<IUser | Error> {
    try {
      const user = await this.user.findById(_id).select(["-password"]);

      if (!user) {
        throw new Error("No logged in user account");
      }

      return user;
    } catch (error) {
      throw new Error("Unable to get user account");
    }
  }

  public async find(props: Props): Promise<IUser | Array<IUser> | Error> {
    try {
      const users = await this.user.find(props, null, {
        sort: { createdAt: -1 },
      });

      if (!users) {
        throw new Error(`Unable to find users with that props`);
      }

      return users;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async delete(_id: Schema.Types.ObjectId): Promise<IUser | Error> {
    try {
      const user = await this.user.findByIdAndDelete(_id);

      if (!user) {
        throw new Error("Unable to delete user account with that id");
      }

      return user;
    } catch (error) {
      throw new Error("Unable to delete user account");
    }
  }

  public async adminDelete(_id: Schema.Types.ObjectId): Promise<IUser | Error> {
    try {
      const user = await this.user
        .findByIdAndDelete(_id)
        .select(["-password"])
        .exec();

      if (!user) {
        throw new Error("Unable to delete user with that data");
      }

      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async adminUpdate(
    _id: Schema.Types.ObjectId,
    role: string
  ): Promise<IUser | Error> {
    try {
      const user = await this.user
        .findByIdAndUpdate(
          _id,
          {
            role: role,
          },
          { new: true }
        )
        .select(["-password"])
        .exec();

      if (!user) {
        throw new Error("Unable to update user with that data");
      }

      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async adminFind(props: Props): Promise<IUser | Array<IUser> | Error> {
    try {
      const users = await this.user.find(props).select(["-password"]).exec();

      if (!users) {
        throw new Error("Unable to find users");
      }

      return users;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default UserService;