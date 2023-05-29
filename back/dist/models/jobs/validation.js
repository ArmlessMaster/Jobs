"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const create = joi_1.default.object({
    title: joi_1.default.string().required(),
    company: joi_1.default.string().required(),
    type: joi_1.default.string().required(),
    location: joi_1.default.array().items(joi_1.default.string()).required(),
    priceFrom: joi_1.default.number().required(),
    priceTo: joi_1.default.number().required().greater(joi_1.default.ref("priceFrom")),
    link: joi_1.default.string().required(),
    experience: joi_1.default.array().items(joi_1.default.string()).required(),
    about: joi_1.default.string().required(),
    days: joi_1.default.number().required(),
    topDays: joi_1.default.number().required(),
    key: joi_1.default.string().required(),
    images: joi_1.default.array(),
    isTop: joi_1.default.boolean()
});
const update = joi_1.default.object({
    _id: joi_1.default.string().hex().length(24).required(),
    title: joi_1.default.string(),
    company: joi_1.default.string(),
    type: joi_1.default.string(),
    location: joi_1.default.array().items(joi_1.default.string()),
    priceFrom: joi_1.default.number(),
    priceTo: joi_1.default.number().greater(joi_1.default.ref("priceFrom")),
    link: joi_1.default.string(),
    experience: joi_1.default.array().items(joi_1.default.string()),
    about: joi_1.default.string(),
    isActive: joi_1.default.boolean(),
    images: joi_1.default.array(),
    imagesUrls: joi_1.default.array().items(joi_1.default.string()),
});
const renewal = joi_1.default.object({
    _id: joi_1.default.string().hex().length(24).required(),
    days: joi_1.default.number().integer().min(1).required(),
    key: joi_1.default.string().required(),
});
const top = joi_1.default.object({
    _id: joi_1.default.string().hex().length(24).required(),
    days: joi_1.default.number().integer().min(1).required(),
    key: joi_1.default.string().required(),
});
const find = joi_1.default.object({
    user_id: joi_1.default.string().hex().length(24),
    title: joi_1.default.string(),
    company: joi_1.default.string(),
    type: joi_1.default.string(),
    location: joi_1.default.string(),
    priceFrom: joi_1.default.number(),
    priceTo: joi_1.default.number(),
    link: joi_1.default.string(),
    experience: joi_1.default.string(),
    about: joi_1.default.string(),
    isActive: joi_1.default.boolean(),
    limit: joi_1.default.number().default(0),
    validityDate: joi_1.default.date(),
    topValidityDate: joi_1.default.date(),
    isTop: joi_1.default.boolean()
});
const adminFind = joi_1.default.object({
    _id: joi_1.default.string().hex().length(24).required(),
});
const imageDelete = joi_1.default.object({
    _id: joi_1.default.string().hex().length(24).required(),
    url: joi_1.default.string().required(),
});
const deleteJob = joi_1.default.object({
    _id: joi_1.default.string().hex().length(24).required()
});
exports.default = {
    create,
    update,
    renewal,
    top,
    find,
    adminFind,
    deleteJob,
    imageDelete
};
