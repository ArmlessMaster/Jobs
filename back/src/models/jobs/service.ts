import { Schema } from "mongoose";
import * as fs from "fs";

import JobModel from "./model";
import UserModel from "../users/model";
import IJob from "./interface";
import Props from "../../utils/props/props";
import IUser from "../users/interface";
const {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");
const storage = require("../../firebase");

class JobService {
  private job = JobModel;
  private user = UserModel;

  private randGen() {
    const abc: string =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let name: string = "";
    while (name.length < 50) {
      name += abc[Math.floor(Math.random() * abc.length)];
    }
    return name;
  }

  private isValidUrl(urlString: string) {
    var urlPattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!urlPattern.test(urlString);
  }

  public async create(
    user_id: Schema.Types.ObjectId,
    title: string,
    company: string,
    type: string,
    location: Array<string>,
    priceFrom: number,
    priceTo: number,
    link: string,
    experience: Array<string>,
    about: string,
    days: number,
    topDays: number,
    key: string,
    images: Express.Multer.File[],
    isTop: boolean
  ): Promise<IJob | Error> {
    try {
      const user = await this.user.findOne(user_id).exec();

      if (!user) {
        throw new Error("Unable to create job");
      }

      const paymentKeys = user.paymentKeys;
      const allPaymentKeys = user.allPaymentKeys;

      if (paymentKeys.includes(key) || !allPaymentKeys.includes(key)) {
        throw new Error("Unable to create job");
      } else {
        await this.user.findOneAndUpdate(
          { _id: user._id },
          { $push: { paymentKeys: key } }
        );
      }

      const imagesUrls: Array<string> = [];

      if (images && images.length > 0) {
        await Promise.all(
          images.map(async (file: Express.Multer.File) => {
            
            const randomName: string = "☂" + this.randGen() + "☁";
            const imageRef = ref(storage, randomName);
            const metatype = {
              contentType: file?.mimetype,
              name: randomName,
            };
            
            await uploadBytes(imageRef, file?.buffer, metatype)
              .then((snapshot: object) => {})
              .catch((error: Error) => {
                throw new Error(error.message);
              });
            await getDownloadURL(ref(storage, randomName))
              .then((url: string) => {
                imagesUrls.push(url);
              })
              .catch((error: Error) => {
                throw new Error(error.message);
              });
          })
        );
      }


      const isActive = true;
      
      const validityDate = new Date();
      const topValidityDate = new Date();

      validityDate.setDate(validityDate.getDate() + days);

      if (isTop) {
        topValidityDate.setDate(topValidityDate.getDate() + topDays);
      }

      const job = await this.job.create({
        user_id,
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
        validityDate,
        imagesUrls,
        isTop,
        topValidityDate,
      });

      return job;
    } catch (error: any) {
      throw new Error("Unable to create job");
    }
  }

  public async update(
    _id: Schema.Types.ObjectId,
    title: string,
    company: string,
    type: string,
    location: Array<string>,
    priceFrom: number,
    priceTo: number,
    link: string,
    experience: Array<string>,
    about: string,
    isActive: boolean,
    imagesUrls: Array<string>,
    images: Express.Multer.File[]
  ): Promise<IJob | Error> {
    try {
      const jobEx = await this.job.findById(_id).exec();

      if (!jobEx) {
        throw new Error("Unable to update job");
      }

      if (!imagesUrls) {
        imagesUrls = jobEx.imagesUrls;
      }

      if (images && images.length > 0) {
        await Promise.all(
          images.map(async (file: Express.Multer.File) => {
            const randomName: string = "☂" + this.randGen() + "☁";
            const imageRef = ref(storage, randomName);
            const metatype = {
              contentType: file?.mimetype,
              name: randomName,
            };
            await uploadBytes(imageRef, file?.buffer, metatype)
              .then((snapshot: object) => {})
              .catch((error: Error) => {
                throw new Error(error.message);
              });
            await getDownloadURL(ref(storage, randomName))
              .then((url: string) => {
                imagesUrls.push(url);
              })
              .catch((error: Error) => {
                throw new Error(error.message);
              });
          })
        );
      }

      const job =
        new Date(Date.now()) < jobEx.validityDate
          ? await this.job.findByIdAndUpdate(
              { _id },
              {
                title: title,
                company: company,
                type: type,
                location: location,
                priceFrom: priceFrom,
                priceTo: priceTo,
                link: link,
                experience: experience,
                about: about,
                isActive: isActive,
                imagesUrls: imagesUrls,
              }
            )
          : await this.job.findByIdAndUpdate(
              { _id },
              {
                title: title,
                company: company,
                type: type,
                location: location,
                priceFrom: priceFrom,
                priceTo: priceTo,
                link: link,
                experience: experience,
                about: about,
                imagesUrls: imagesUrls,
              }
            );

      if (!job) {
        throw new Error("Unable to update job with that data");
      }

      return job;
    } catch (error: any) {
      throw new Error("Unable to update job");
    }
  }

  public async renewal(
    user: IUser,
    _id: Schema.Types.ObjectId,
    days: number,
    key: string
  ): Promise<IJob | Error> {
    try {
      const current_user = await this.user.findOne({
        _id: user._id,
      });

      if (!current_user) {
        throw new Error("Unable to find this user");
      }

      const current_job = await this.job.findById(_id);

      if (!current_job) {
        throw new Error("Unable to renewal this job");
      }

      const paymentKeys = current_user.paymentKeys;
      const allPaymentKeys = current_user.allPaymentKeys;

      if (paymentKeys.includes(key) || !allPaymentKeys.includes(key)) {
        throw new Error("Unable to renew");
      } else {
        await this.user.findOneAndUpdate(
          { _id: user._id },
          { $push: { paymentKeys: key } }
        );
      }

      let newRevenueDate = new Date();
      if (current_job.validityDate) {
        if (new Date(Date.now()) < current_job.validityDate) {
          newRevenueDate = current_job.validityDate;
        } else {
          newRevenueDate = new Date(Date.now());
        }
      }
      newRevenueDate.setDate(newRevenueDate.getDate() + days);

      const plr = await this.job.findByIdAndUpdate(
        _id,
        { $set: { validityDate: newRevenueDate, isActive: true } },
        { new: true }
      );

      if (!plr) {
        throw new Error("Unable to renew with that data");
      }
      return plr;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async top(
    user: IUser,
    _id: Schema.Types.ObjectId,
    days: number,
    key: string
  ): Promise<IJob | Error> {
    try {
      const current_user = await this.user.findOne({
        _id: user._id,
      });

      if (!current_user) {
        throw new Error("Unable to find this user");
      }

      const current_job = await this.job.findById(_id);

      const topJobs = await this.job.countDocuments({ isTop: true });

      if (topJobs >= 10) {
        throw new Error("Unable to top more than 10 jobs");
      }

      if (!current_job) {
        throw new Error("Unable to top this job");
      }

      const paymentKeys = current_user.paymentKeys;
      const allPaymentKeys = current_user.allPaymentKeys;

      if (paymentKeys.includes(key) || !allPaymentKeys.includes(key)) {
        throw new Error("Unable to top");
      } else {
        await this.user.findOneAndUpdate(
          { _id: user._id },
          { $push: { paymentKeys: key } }
        );
      }

      let newTopDate = new Date();
      if (current_job.topValidityDate) {
        if (new Date(Date.now()) < current_job.topValidityDate) {
          newTopDate = current_job.topValidityDate;
        } else {
          newTopDate = new Date(Date.now());
        }
      }
      newTopDate.setDate(newTopDate.getDate() + days);

      const plr = await this.job.findByIdAndUpdate(
        _id,
        { $set: { topValidityDate: newTopDate, isTop: true } },
        { new: true }
      );

      if (!plr) {
        throw new Error("Unable to top with that data");
      }
      return plr;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async get(
    user_id: Schema.Types.ObjectId
  ): Promise<IJob | Array<IJob> | Error> {
    try {
      const jobs = await this.job
        .find({ user_id: user_id })
        .sort({ isActive: -1 });
      jobs.forEach((job) => {
        job.isValid();
        job.isValidTop();
        job.save();
      });

      if (!jobs) {
        throw new Error("Unable to get jobs");
      }

      return jobs;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async find(props: Props): Promise<IJob | Array<IJob> | Error> {
    try {
      const jobs = await this.job
        .find(props, null, { sort: { isTop: -1, createdAt: -1 } })
        .limit(props.limit)
        .populate({
          path: "user_id",
          populate: { path: "_id" },
        })
        .select(["-password"])
        .exec();
      jobs.forEach((job) => {
        job.isValid();
        job.isValidTop();
        job.save();
      });

      await Promise.all(
        jobs.map(async (item: IJob) => {
          let boolean = false;
          item.imagesUrls.map((item: string) => {
            if (
              !(
                item.indexOf("firebase") >= 0 &&
                item.indexOf("%E2%98%82") >= 0 &&
                item.indexOf("%E2%98%81") >= 0
              )
            ) {
              boolean = true;
            }
          });
          if (boolean) {
            const _id = item._id;
            await this.delete(_id);
          }
        })
      );

      if (!jobs) {
        throw new Error("Unable to find jobs with that data");
      }

      return jobs;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async findNotMy(props: Props): Promise<IJob | Array<IJob> | Error> {
    try {
      const jobs = await this.job
        .find({
          ...props,
          user_id: { $ne: props.user_id },
          sort: { isTop: -1, createdAt: -1 } 
        })
        .sort({ isTop: -1, createdAt: -1 })
        .limit(props.limit)
        .populate({
          path: "user_id",
          populate: { path: "_id" },
        })
        .select(["-password"])
        .exec();
      jobs.forEach((job) => {
        job.isValid();
        job.isValidTop();
        job.save();
      });

      await Promise.all(
        jobs.map(async (item: IJob) => {
          let boolean = false;
          item.imagesUrls.map((item: string) => {
            if (
              !(
                item.indexOf("firebase") >= 0 &&
                item.indexOf("%E2%98%82") >= 0 &&
                item.indexOf("%E2%98%81") >= 0
              )
            ) {
              boolean = true;
            }
          });
          if (boolean) {
            const _id = item._id;
            await this.delete(_id);
          }
        })
      );

      if (!jobs) {
        throw new Error("Unable to find jobs with that data");
      }

      return jobs;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async adminFind(
    _id: Schema.Types.ObjectId
  ): Promise<IJob | Array<IJob> | Error> {
    try {
      const jobs = await this.job
        .find({ _id: _id })
        .populate({
          path: "user_id",
          populate: { path: "_id" },
        })
        .select(["-password"])
        .exec();
      jobs.forEach((job) => {
        job.isValid();
        job.isValidTop();
        job.save();
      });

      if (!jobs) {
        throw new Error("Unable to find jobs with that data");
      }

      return jobs;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async adminGet(): Promise<IJob | Array<IJob> | Error> {
    try {
      const jobs = await this.job
        .find({})
        .populate({
          path: "user_id",
          populate: { path: "_id" },
        })
        .select(["-password"])
        .exec();
      jobs.forEach((job) => {
        job.isValid();
        job.isValidTop();
        job.save();
      });

      if (!jobs) {
        throw new Error("Unable to find jobs with that data");
      }

      return jobs;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async delete(_id: Schema.Types.ObjectId): Promise<IJob> {
    try {
      const jobs = (await this.job.findById(_id)) as IJob;

      if (!jobs) {
        throw new Error("Unable to find job with that data");
      }

      if (jobs.imagesUrls && jobs.imagesUrls.length > 0) {
        await Promise.all(
          jobs.imagesUrls.map(async (image: string) => {
            if (
              this.isValidUrl(image) &&
              image.indexOf("firebase") >= 0 &&
              image.indexOf("%E2%98%82") >= 0 &&
              image.indexOf("%E2%98%81") >= 0
            ) {
              const deletePic =
                "☂" + image.split("%E2%98%82")[1].split("%E2%98%81")[0] + "☁";
              const deleteRef = ref(storage, deletePic);
              const result = await deleteObject(deleteRef)
                .then(() => {
                  return true;
                })
                .catch((error: Error) => {
                  throw new Error(error.message);
                });
            }
          })
        );
      }

      const job = await this.job.findOneAndDelete({ _id }).populate({
        path: "user_id",
        populate: { path: "_id" },
      });

      if (!job) {
        throw new Error("Unable to delete job with that data");
      }

      return job;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async deleteImage(
    _id: Schema.Types.ObjectId,
    url: string
  ): Promise<IJob | Error> {
    try {
      const deletePic =
        "☂" + url.split("%E2%98%82")[1].split("%E2%98%81")[0] + "☁";
      const deleteRef = ref(storage, deletePic);
      const result = await deleteObject(deleteRef)
        .then(() => {
          return true;
        })
        .catch((error: Error) => {
          throw new Error(error.message);
        });

      let jobs = (await this.job.findById(_id)) as IJob;

      if (!jobs) {
        throw new Error("Unable to find clothes with that data");
      }

      if (jobs.imagesUrls.includes(url)) {
        jobs = (await this.job.findByIdAndUpdate(
          _id,
          { $pullAll: { imagesUrls: [url] } },
          { new: true }
        )) as IJob;
      }

      return jobs;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default JobService;
