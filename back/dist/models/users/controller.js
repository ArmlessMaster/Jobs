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
class UserController {
    constructor() {
        this.path = "/user";
        this.router = (0, express_1.Router)();
        this.userService = new service_1.default();
        this.client_url = process.env.CLIENT_URL;
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const token = (yield this.userService.login(email, password));
                res.cookie("refreshToken", token.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                });
                res.status(201).json(token);
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const token = (yield this.userService.register(email, password));
                res.cookie("refreshToken", token.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                });
                res.status(201).json(token);
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.logout = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const token = yield this.userService.logout(refreshToken);
                res.clearCookie("refreshToken");
                res.status(201).json(token);
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.refresh = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const token = (yield this.userService.refresh(refreshToken));
                res.cookie("refreshToken", token.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                });
                res.status(201).json(token);
            }
            catch (error) {
                yield this.logout(req, res, next);
                if (!res.headersSent) {
                    next(new exception_1.default(401, "Unauthorised"));
                }
            }
        });
        this.updatePassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { new_password, password } = req.body;
                const _id = req.user._id;
                const user = yield this.userService.updatePassword(_id, new_password, password);
                res.status(200).json({ user });
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.payment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { days, price, oldPrice, name } = req.body;
                const url = yield this.userService.payment(req.user, days, price, oldPrice, this.client_url, name);
                res.status(200).json({ data: url });
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.getAllUsers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.getAllUsers();
                res.status(200).json({ user: user });
            }
            catch (error) {
                next(new exception_1.default(400, "Cannot found user"));
            }
        });
        this.getAllUsersWithoutAdmin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.getAllUsersWithoutAdmin();
                res.status(200).json({ user });
            }
            catch (error) {
                next(new exception_1.default(400, "Cannot found user"));
            }
        });
        this.getUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.body;
                const user = yield this.userService.getUser(_id);
                res.status(200).json({ user });
            }
            catch (error) {
                next(new exception_1.default(400, "Cannot found user"));
            }
        });
        this.getMe = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = req.user._id;
                const user = yield this.userService.getUser(_id);
                res.status(200).json({ user });
            }
            catch (error) {
                next(new exception_1.default(400, "Cannot found user"));
            }
        });
        this.find = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const props = req.body;
                const accounts = yield this.userService.find(props);
                res.status(200).json({ accounts });
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = req.user._id;
                const user = yield this.userService.delete(_id);
                res.status(200).json({ user });
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.adminDelete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.body;
                const user = yield this.userService.adminDelete(_id);
                res.status(200).json({ user });
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.adminUpdate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, role } = req.body;
                const user = yield this.userService.adminUpdate(_id, role);
                res.status(200).json({ user });
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.adminFind = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const props = req.body;
                const accounts = yield this.userService.adminFind(props);
                res.status(200).json({ accounts });
            }
            catch (error) {
                next(new exception_1.default(400, error.message));
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`${this.path}/login`, (0, middlewares_1.validationMiddleware)(validation_1.default.login), this.login);
        this.router.post(`${this.path}/register`, (0, middlewares_1.validationMiddleware)(validation_1.default.register), this.register);
        this.router.post(`${this.path}/logout`, this.logout);
        this.router.put(`${this.path}/payment`, (0, middlewares_1.validationMiddleware)(validation_1.default.payment), middlewares_1.authenticatedMiddleware, this.payment);
        this.router.put(`${this.path}/update/password`, (0, middlewares_1.validationMiddleware)(validation_1.default.updatePassword), middlewares_1.authenticatedMiddleware, this.updatePassword);
        this.router.put(`${this.path}/admin/update`, middlewares_1.authenticatedMiddleware, middlewares_1.adminPermissionMiddleware, this.adminUpdate);
        this.router.get(`${this.path}/refresh`, this.refresh);
        this.router.get(`${this.path}/all`, middlewares_1.authenticatedMiddleware, this.getAllUsers);
        this.router.get(`${this.path}/users`, middlewares_1.authenticatedMiddleware, this.getAllUsersWithoutAdmin);
        this.router.get(`${this.path}/get`, (0, middlewares_1.validationMiddleware)(validation_1.default.getUser), middlewares_1.authenticatedMiddleware, this.getUser);
        this.router.get(`${this.path}/me`, middlewares_1.authenticatedMiddleware, this.getMe);
        this.router.get(`${this.path}/find`, (0, middlewares_1.validationMiddleware)(validation_1.default.find), this.find);
        this.router.get(`${this.path}/admin/find`, (0, middlewares_1.validationMiddleware)(validation_1.default.adminFind), middlewares_1.authenticatedMiddleware, middlewares_1.adminPermissionMiddleware, this.adminFind);
        this.router.delete(`${this.path}/delete`, (0, middlewares_1.validationMiddleware)(validation_1.default.deleteUser), middlewares_1.authenticatedMiddleware, this.delete);
        this.router.delete(`${this.path}/admin/delete`, middlewares_1.authenticatedMiddleware, middlewares_1.adminPermissionMiddleware, this.adminDelete);
    }
}
exports.default = UserController;
