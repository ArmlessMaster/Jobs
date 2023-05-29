import { Schema, model } from "mongoose";

import IJob from "./interface";

const JobSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    title: {
      type: String,
    },
    company: {
      type: String,
    },
    type: {
      type: String,
    },
    location: [
      {
        type: String,
      },
    ],
    priceFrom:
    {
      type: Number,
    },
    priceTo:
    {
      type: Number,
    },
    link: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    experience: [
      {
        type: String,
      },
    ],
    about: {
      type: String,
    },
    validityDate: {
      type: Date,
    },
    isTop: {
      type: Boolean,
      default: false,
    },
    topValidityDate: {
      type: Date,
    },
    imagesUrls: {
      type: Array<String>,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

JobSchema.methods.isValid = async function (): Promise<
  Error | void
> {
  if(new Date(Date.now()) > this.validityDate){
    this.isActive = false;
  }
};

JobSchema.methods.isValidTop = async function (): Promise<
  Error | void
> {
  if(new Date(Date.now()) > this.topValidityDate){
    this.isTop = false;
  }
};

export default model<IJob>("Jobs", JobSchema);