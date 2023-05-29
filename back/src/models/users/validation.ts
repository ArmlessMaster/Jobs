import Joi from "joi";

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const register = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  passwordConfirmation: Joi.any().equal(Joi.ref("password")).required()
});

const updatePassword = Joi.object({
  _id: Joi.string().hex().length(24),
  password: Joi.string().min(8).required(),
  new_password: Joi.string().min(8).required(),
});

const payment = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  oldPrice: Joi.number().required(),
  days: Joi.number().integer().min(1).required(),
});

const getUser = Joi.object({
  _id: Joi.string().hex().length(24).required(),
});

const adminFind = Joi.object({
  _id: Joi.string().hex().length(24),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  role: Joi.string(),
});

const find = Joi.object({
  _id: Joi.string().hex().length(24),
  email: Joi.string().email(),
  role: Joi.string(),
});

const deleteUser = Joi.object({
  _id: Joi.string().hex().length(24),
});

export default {
  register,
  login,
  updatePassword,
  payment,
  getUser,
  deleteUser,
  adminFind,
  find
};