"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const exception_1 = __importDefault(require("../../utils/exception/exception"));
const service_1 = __importDefault(require("./service"));
const validation_1 = __importDefault(require("./validation"));
const middlewares_1 = require("../../middlewares");
const multer = require("multer");
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });
class JobController {
    constructor() {
        this.path = "/job";
        this.router = (0, express_1.Router)();
        this.jobService = new service_1.default();
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = req.user._id;
                const { title, company, type, location, priceFrom, priceTo, link, experience, about, days, topDays, key, images, isTop, } = req.body;
                const job = yield this.jobService.create(_id, title, company, type, location, priceFrom, priceTo, link, experience, about, days, topDays, key, images, isTop);
                res.status(201).json({ job });
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, title, company, type, location, priceFrom, priceTo, link, experience, about, isActive, images, imagesUrls, } = req.body;
                const job = yield this.jobService.update(_id, title, company, type, location, priceFrom, priceTo, link, experience, about, isActive, images, imagesUrls);
                res.status(201).json({ job });
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.body;
                const job = yield this.jobService.delete(_id);
                res.status(201).json({ job });
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.deleteImage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, url } = req.body;
                const job = yield this.jobService.deleteImage(_id, url);
                res.status(201).json({ data: job });
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.renewal = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, days, key } = req.body;
                const job = (yield this.jobService.renewal(req.user, _id, days, key));
                res.status(200).json({ job });
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.top = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, days, key } = req.body;
                const job = (yield this.jobService.top(req.user, _id, days, key));
                res.status(200).json({ job });
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = req.user._id;
                const jobs = yield this.jobService.get(_id);
                res.status(200).json({ jobs });
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.find = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const props = req.body;
                const experience = req.query.experience;
                const location = req.query.location;
                let experiences = [];
                let locations = [];
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
                }
                else if (experiences.length > 0) {
                    query = { experience: { $all: experiences }, isActive: true };
                }
                else if (locations.length > 0) {
                    query = { location: { $all: locations }, isActive: true };
                }
                const jobs = yield this.jobService.find(experiences.length > 0 || locations.length > 0 ? query : props);
                res.status(200).json({ jobs });
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.findNotMy = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const props = req.body;
                const experience = req.query.experience;
                const location = req.query.location;
                let experiences = [];
                let locations = [];
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
                }
                else if (experiences.length > 0) {
                    query = { experience: { $all: experiences }, isActive: true, user_id: props.user_id };
                }
                else if (locations.length > 0) {
                    query = { location: { $all: locations }, isActive: true, user_id: props.user_id };
                }
                const jobs = yield this.jobService.findNotMy(experiences.length > 0 || locations.length > 0 ? query : props);
                res.status(200).json({ jobs });
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.adminGet = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield this.jobService.adminGet();
                res.status(200).json({ data: jobs });
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.adminFind = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.body;
                const jobs = yield this.jobService.adminFind(_id);
                res.status(200).json({ jobs });
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`${this.path}/create`, upload.array("pic"), (0, middlewares_1.validationMiddleware)(validation_1.default.create), middlewares_1.authenticatedMiddleware, this.create);
        this.router.put(`${this.path}/update`, upload.array("pic"), (0, middlewares_1.validationMiddleware)(validation_1.default.update), middlewares_1.authenticatedMiddleware, this.update);
        this.router.put(`${this.path}/renewal`, (0, middlewares_1.validationMiddleware)(validation_1.default.renewal), middlewares_1.authenticatedMiddleware, this.renewal);
        this.router.put(`${this.path}/top`, (0, middlewares_1.validationMiddleware)(validation_1.default.top), middlewares_1.authenticatedMiddleware, this.top);
        this.router.get(`${this.path}/get`, middlewares_1.authenticatedMiddleware, this.get);
        this.router.get(`${this.path}/find`, (0, middlewares_1.validationMiddleware)(validation_1.default.find), this.find);
        this.router.get(`${this.path}/find/not/my`, (0, middlewares_1.validationMiddleware)(validation_1.default.find), this.findNotMy);
        this.router.get(`${this.path}/admin/get`, middlewares_1.authenticatedMiddleware, middlewares_1.adminPermissionMiddleware, this.adminGet);
        this.router.get(`${this.path}/admin/find`, (0, middlewares_1.validationMiddleware)(validation_1.default.adminFind), middlewares_1.authenticatedMiddleware, middlewares_1.adminPermissionMiddleware, this.adminFind);
        this.router.delete(`${this.path}/delete`, (0, middlewares_1.validationMiddleware)(validation_1.default.deleteJob), middlewares_1.authenticatedMiddleware, this.delete);
        this.router.delete(`${this.path}/image/delete`, (0, middlewares_1.validationMiddleware)(validation_1.default.imageDelete), middlewares_1.authenticatedMiddleware, this.deleteImage);
    }
}
exports.default = JobController;
