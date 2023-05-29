"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const login = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
const register = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).required(),
    passwordConfirmation: joi_1.default.any().equal(joi_1.default.ref("password")).required()
});
const updatePassword = joi_1.default.object({
    _id: joi_1.default.string().hex().length(24),
    password: joi_1.default.string().min(8).required(),
    new_password: joi_1.default.string().min(8).required(),
});
const payment = joi_1.default.object({
    name: joi_1.default.string().required(),
    price: joi_1.default.number().required(),
    oldPrice: joi_1.default.number().required(),
    days: joi_1.default.number().integer().min(1).required(),
});
const getUser = joi_1.default.object({
    _id: joi_1.default.string().hex().length(24).required(),
});
const adminFind = joi_1.default.object({
    _id: joi_1.default.string().hex().length(24),
    email: joi_1.default.string().email(),
    password: joi_1.default.string().min(6),
    role: joi_1.default.string(),
});
const find = joi_1.default.object({
    _id: joi_1.default.string().hex().length(24),
    email: joi_1.default.string().email(),
    role: joi_1.default.string(),
});
const deleteUser = joi_1.default.object({
    _id: joi_1.default.string().hex().length(24),
});
exports.default = {
    register,
    login,
    updatePassword,
    payment,
    getUser,
    deleteUser,
    adminFind,
    find
};
