import { Router, Request, Response, NextFunction } from "express";

import { IController } from "../../utils/interfaces";
import HttpException from "../../utils/exception/exception";
import JobService from "./service";
import validate from "./validation";
import {
  authenticatedMiddleware,
  validationMiddleware,
  adminPermissionMiddleware,
} from "../../middlewares";
import IJob from "./interface";
const multer = require("multer");
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

class JobController implements IController {
  public path = "/job";
  public router = Router();
  private jobService = new JobService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}/create`,
      upload.array("pic"),
      validationMiddleware(validate.create),
      authenticatedMiddleware,
      this.create
    );

    this.router.put(
      `${this.path}/update`,
      upload.array("pic"),
      validationMiddleware(validate.update),
      authenticatedMiddleware,
      this.update
    );

    this.router.put(
      `${this.path}/renewal`,
      validationMiddleware(validate.renewal),
      authenticatedMiddleware,
      this.renewal
    );

    this.router.put(
      `${this.path}/top`,
      validationMiddleware(validate.top),
      authenticatedMiddleware,
      this.top
    );

    this.router.get(`${this.path}/get`, authenticatedMiddleware, this.get);

    this.router.get(
      `${this.path}/find`,
      validationMiddleware(validate.find),
      this.find
    );

    this.router.get(
      `${this.path}/find/not/my`,
      validationMiddleware(validate.find),
      this.findNotMy
    );

    this.router.get(
      `${this.path}/admin/get`,
      authenticatedMiddleware,
      adminPermissionMiddleware,
      this.adminGet
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
      validationMiddleware(validate.deleteJob),
      authenticatedMiddleware,
      this.delete
    );

    this.router.delete(
      `${this.path}/image/delete`,
      validationMiddleware(validate.imageDelete),
      authenticatedMiddleware,
      this.deleteImage
    );
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const _id = req.user._id;
      const {
        title,
        company,
        type,
        location,
        priceFrom,
        priceTo,
        link,
        experience,
        about,
        days,
        topDays,
        key,
        images,
        isTop,
      } = req.body;

      const job = await this.jobService.create(
        _id,
        title,
        company,
        type,
        location,
        priceFrom,
        priceTo,
        link,
        experience,
        about,
        days,
        topDays,
        key,
        images,
        isTop
      );

      res.status(201).json({ job });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const {
        _id,
        title,
        company,
        type,
        location,
        priceFrom,
        priceTo,
        link,
        experience,
        about,
        isActive,
        images,
        imagesUrls,
      } = req.body;

      const job = await this.jobService.update(
        _id,
        title,
        company,
        type,
        location,
        priceFrom,
        priceTo,
        link,
        experience,
        about,
        isActive,
        images,
        imagesUrls
      );

      res.status(201).json({ job });
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
      const { _id } = req.body;

      const job = await this.jobService.delete(_id);

      res.status(201).json({ job });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private deleteImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { _id, url } = req.body;

      const job = await this.jobService.deleteImage(_id, url);

      res.status(201).json({ data: job });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private renewal = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { _id, days, key } = req.body;

      const job = (await this.jobService.renewal(
        req.user,
        _id,
        days,
        key
      )) as IJob;

      res.status(200).json({ job });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private top = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { _id, days, key } = req.body;

      const job = (await this.jobService.top(req.user, _id, days, key)) as IJob;

      res.status(200).json({ job });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private get = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const _id = req.user._id;

      const jobs = await this.jobService.get(_id);

      res.status(200).json({ jobs });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private find = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const props = req.body;
      const experience = req.query.experience;
      const location = req.query.location;

      let experiences: string[] = [];
      let locations: string[] = [];

      if (typeof experience === "string") {
        experiences = experience.split(",");
      }

      if (typeof location === "string") {
        locations = location.split(",");
      }

      let query = {};
      if (experiences.length > 0 && locations.length > 0) {
        query = {
          experience: { $all: experiences },
          location: { $all: locations },
          isActive: true,
        };
      } else if (experiences.length > 0) {
        query = { experience: { $all: experiences }, isActive: true };
      } else if (locations.length > 0) {
        query = { location: { $all: locations }, isActive: true };
      }

      const jobs = await this.jobService.find(
        experiences.length > 0 || locations.length > 0 ? query : props
      );

      res.status(200).json({ jobs });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private findNotMy = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const props = req.body;
      const experience = req.query.experience;
      const location = req.query.location;

      let experiences: string[] = [];
      let locations: string[] = [];

      if (typeof experience === "string") {
        experiences = experience.split(",");
      }

      if (typeof location === "string") {
        locations = location.split(",");
      }

      let query = {};
      if (experiences.length > 0 && locations.length > 0) {
        query = {
          experience: { $all: experiences },
          location: { $all: locations },
          isActive: true,
          user_id: props.user_id
        };
      } else if (experiences.length > 0) {
        query = { experience: { $all: experiences }, isActive: true, user_id: props.user_id };
      } else if (locations.length > 0) {
        query = { location: { $all: locations }, isActive: true, user_id: props.user_id };
      }

      const jobs = await this.jobService.findNotMy(
        experiences.length > 0 || locations.length > 0 ? query : props
      );

      res.status(200).json({ jobs });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private adminGet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const jobs = await this.jobService.adminGet();

      res.status(200).json({ data: jobs });
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
      const { _id } = req.body;

      const jobs = await this.jobService.adminFind(_id);

      res.status(200).json({ jobs });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default JobController;
