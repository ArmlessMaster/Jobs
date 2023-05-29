import Joi from "joi";

const create = Joi.object({
  title: Joi.string().required(),
  company: Joi.string().required(),
  type: Joi.string().required(),
  location: Joi.array().items(Joi.string()).required(),
  priceFrom: Joi.number().required(),
  priceTo: Joi.number().required().greater(Joi.ref("priceFrom")),
  link: Joi.string().required(),
  experience: Joi.array().items(Joi.string()).required(),
  about: Joi.string().required(),
  days: Joi.number().required(),
  topDays: Joi.number().required(),
  key: Joi.string().required(),
  images: Joi.array(),
  isTop: Joi.boolean()
});

const update = Joi.object({
  _id: Joi.string().hex().length(24).required(),
  title: Joi.string(),
  company: Joi.string(),
  type: Joi.string(),
  location: Joi.array().items(Joi.string()),
  priceFrom: Joi.number(),
  priceTo: Joi.number().greater(Joi.ref("priceFrom")),
  link: Joi.string(),
  experience: Joi.array().items(Joi.string()),
  about: Joi.string(),
  isActive: Joi.boolean(),
  images: Joi.array(),
  imagesUrls: Joi.array().items(Joi.string()),
});

const renewal = Joi.object({
  _id: Joi.string().hex().length(24).required(),
  days: Joi.number().integer().min(1).required(),
  key: Joi.string().required(),
});

const top = Joi.object({
  _id: Joi.string().hex().length(24).required(),
  days: Joi.number().integer().min(1).required(),
  key: Joi.string().required(),
});

const find = Joi.object({
  user_id: Joi.string().hex().length(24),
  title: Joi.string(),
  company: Joi.string(),
  type: Joi.string(),
  location: Joi.string(),
  priceFrom: Joi.number(),
  priceTo: Joi.number(),
  link: Joi.string(),
  experience: Joi.string(),
  about: Joi.string(),
  isActive: Joi.boolean(),
  limit: Joi.number().default(0),
  validityDate: Joi.date(),
  topValidityDate: Joi.date(),
  isTop: Joi.boolean()
});

const adminFind = Joi.object({
  _id: Joi.string().hex().length(24).required(),
});

const imageDelete = Joi.object({
  _id: Joi.string().hex().length(24).required(),
  url: Joi.string().required(),
});

const deleteJob = Joi.object({
  _id: Joi.string().hex().length(24).required()
});

export default {
  create,
  update,
  renewal,
  top,
  find,
  adminFind,
  deleteJob,
  imageDelete
};