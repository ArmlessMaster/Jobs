import { Router, Request, Response, NextFunction } from "express";

import { IController } from "../../utils/interfaces";
import HttpException from "../../utils/exception/exception";
import UserService from "./service";
import validate from "./validation";
import {
  authenticatedMiddleware,
  validationMiddleware,
  adminPermissionMiddleware,
} from "../../middlewares";
import Props from "../../utils/props/props";

class UserController implements IController {
  public path = "/user";
  public router = Router();
  private userService = new UserService();
  private client_url = process.env.CLIENT_URL;

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(validate.login),
      this.login
    );

    this.router.post(
      `${this.path}/register`,
      validationMiddleware(validate.register),
      this.register
    );

    this.router.post(`${this.path}/logout`, this.logout);

    this.router.put(
      `${this.path}/payment`,
      validationMiddleware(validate.payment),
      authenticatedMiddleware,
      this.payment
    );

    this.router.put(
      `${this.path}/update/password`,
      validationMiddleware(validate.updatePassword),
      authenticatedMiddleware,
      this.updatePassword
    );

    this.router.put(
      `${this.path}/admin/update`,
      authenticatedMiddleware,
      adminPermissionMiddleware,
      this.adminUpdate
    );

    this.router.get(`${this.path}/refresh`, this.refresh);

    this.router.get(
      `${this.path}/all`,
      authenticatedMiddleware,
      this.getAllUsers
    );

    this.router.get(
      `${this.path}/users`,
      authenticatedMiddleware,
      this.getAllUsersWithoutAdmin
    );

    this.router.get(
      `${this.path}/get`,
      validationMiddleware(validate.getUser),
      authenticatedMiddleware,
      this.getUser
    );

    this.router.get(`${this.path}/me`, authenticatedMiddleware, this.getMe);

    this.router.get(
      `${this.path}/find`,
      validationMiddleware(validate.find),
      this.find
    );

    this.router.get(
      `${this.path}/admin/find`,
      validationMiddleware(validate.adminFind),
      authenticatedMiddleware,
      adminPermissionMiddleware,
      this.adminFind
  );

    this.router.delete(
      `${this.path}/delete`,
      validationMiddleware(validate.deleteUser),
      authenticatedMiddleware,
      this.delete
    );

    this.router.delete(
      `${this.path}/admin/delete`,
      authenticatedMiddleware,
      adminPermissionMiddleware,
      this.adminDelete
    );
  }

  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;

      const token = (await this.userService.login(email, password)) as {
        accessToken: string;
        refreshToken: string;
      };
      res.cookie("refreshToken", token.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.status(201).json(token);
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;

      const token = (await this.userService.register(email, password)) as {
        accessToken: string;
        refreshToken: string;
      };
      res.cookie("refreshToken", token.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.status(201).json(token);
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { refreshToken } = req.cookies;

      const token = await this.userService.logout(refreshToken);
      res.clearCookie("refreshToken");

      res.status(201).json(token);
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private refresh = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { refreshToken } = req.cookies;

      const token = (await this.userService.refresh(refreshToken)) as {
        accessToken: string;
        refreshToken: string;
      };

      res.cookie("refreshToken", token.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.status(201).json(token);
    } catch (error: any) {
      await this.logout(req, res, next);
      if (!res.headersSent) {    
        next(new HttpException(401, "Unauthorised"));
      }
    }
  };

  private updatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { new_password, password } = req.body;
      const _id = req.user._id;

      const user = await this.userService.updatePassword(
        _id,
        new_password,
        password
      );

      res.status(200).json({ user });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private payment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { days, price, oldPrice, name } = req.body;
      
      const url = await this.userService.payment(
        req.user,
        days,
        price,
        oldPrice,
        this.client_url as string,
        name
      );
        
      res.status(200).json({ data: url });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const user = await this.userService.getAllUsers();

      res.status(200).json({ user: user });
    } catch (error) {
      next(new HttpException(400, "Cannot found user"));
    }
  };

  private getAllUsersWithoutAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const user = await this.userService.getAllUsersWithoutAdmin();

      res.status(200).json({ user });
    } catch (error) {
      next(new HttpException(400, "Cannot found user"));
    }
  };

  private getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { _id } = req.body;

      const user = await this.userService.getUser(_id);

      res.status(200).json({ user });
    } catch (error) {
      next(new HttpException(400, "Cannot found user"));
    }
  };

  private getMe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const _id = req.user._id;

      const user = await this.userService.getUser(_id);

      res.status(200).json({ user });
    } catch (error) {
      next(new HttpException(400, "Cannot found user"));
    }
  };

  private find = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const props = req.body as Props;

      const accounts = await this.userService.find(props);

      res.status(200).json({ accounts });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const _id = req.user._id;

      const user = await this.userService.delete(_id);

      res.status(200).json({ user });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private adminDelete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { _id } = req.body;
      const user = await this.userService.adminDelete(_id);

      res.status(200).json({ user });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private adminUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { _id, role } = req.body;

      const user = await this.userService.adminUpdate(_id, role);

      res.status(200).json({ user });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private adminFind = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const props = req.body as Props;
      const accounts = await this.userService.adminFind(props);

      res.status(200).json({ accounts });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default UserController;