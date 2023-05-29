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
const model_1 = __importDefault(require("./model"));
const service_1 = __importDefault(require("../tokens/service"));
const model_2 = __importDefault(require("../tokens/model"));
const validate_1 = require("../../utils/validate");
const functions_1 = require("../../utils/functions/functions");
const stripe = require("stripe")(process.env.STRIPE_KEY);
class UserService {
    constructor() {
        this.user = model_1.default;
        this.token = model_2.default;
        this.tokenService = new service_1.default();
    }
    saveToken(tokens, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                tokens
                    .then((data) => __awaiter(this, void 0, void 0, function* () {
                    yield this.tokenService.saveToken(user.id, data.refreshToken);
                }))
                    .catch((error) => {
                    throw new Error("Unforeseeable error");
                });
            }
            catch (error) {
                throw new Error("Unable to find users");
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user.findOne({ email });
                if (!user) {
                    throw new Error("Unable to find user account with that email address");
                }
                yield this.user
                    .findOneAndUpdate({ email: email }, {
                    allPaymentKeys: [],
                }, { new: true })
                    .exec();
                if (yield user.isValidPassword(password)) {
                    const tokens = this.tokenService.generateTokens(user);
                    this.saveToken(tokens, user);
                    return tokens;
                }
                else {
                    throw new Error("Wrong credentials given");
                }
            }
            catch (error) {
                throw new Error("Unable to login user account");
            }
        });
    }
    register(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExists = yield this.user.findOne({ email });
                if (userExists) {
                    throw new Error("User account already exists");
                }
                const user = yield this.user.create({
                    email,
                    password,
                });
                const tokens = this.tokenService.generateTokens(user);
                this.saveToken(tokens, user);
                return tokens;
            }
            catch (error) {
                throw new Error("Unable to create user account");
            }
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = this.tokenService.removeToken(refreshToken);
                return token;
            }
            catch (error) {
                throw new Error("Unable to delete user token");
            }
        });
    }
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!refreshToken) {
                    throw new Error("User is not logged in");
                }
                const userData = yield validate_1.validateToken.validateRefreshToken(refreshToken);
                const tokenFromDB = yield this.tokenService.findToken(refreshToken);
                if (!userData || !tokenFromDB) {
                    throw new Error("User is not logged in");
                }
                const token = yield this.token.findOne({ refreshToken });
                if (!token) {
                    throw new Error("User is not logged in");
                }
                const user = yield this.user.findById(token.user_id);
                if (!user) {
                    throw new Error("User is not logged in");
                }
                const tokens = this.tokenService.generateTokens(user);
                this.saveToken(tokens, user);
                return tokens;
            }
            catch (error) {
                throw new Error("Unable to refresh user token");
            }
        });
    }
    updatePassword(_id, new_password, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account = yield this.user.findOne({ _id });
                if (!account) {
                    throw new Error("Unable to find account with that id");
                }
                if (yield account.isValidPassword(password)) {
                    const user = yield this.user.findByIdAndUpdate(_id, { password: new_password }, { new: true });
                    if (!user) {
                        throw new Error("Unable to update user account with that id");
                    }
                    return user;
                }
                else {
                    throw new Error("Wrong credentials given");
                }
            }
            catch (error) {
                throw new Error("The old password does not match the entered one");
            }
        });
    }
    payment(user, days, price, oldPrice, my_domain, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const key = (0, functions_1.generateRandomString)(100);
                yield this.user.findOneAndUpdate({ _id: user._id }, { $push: { allPaymentKeys: key } });
                const line_items = [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: name + " " + days + " " + "days",
                                description: `Previous price: ${oldPrice.toFixed(2)}$, new price: ${price.toFixed(2)}$`,
                            },
                            unit_amount: price * 100,
                        },
                        quantity: 1,
                    },
                ];
                const time = new Date().getTime();
                const session = yield stripe.checkout.sessions.create({
                    line_items,
                    mode: "payment",
                    success_url: `${my_domain}/success/${key}/${time}/${days}`,
                    cancel_url: `${my_domain}/canceled`,
                });
                return session.url;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user.find({}).select(["-password"]);
                if (!user) {
                    throw new Error("Unable to find users");
                }
                return user;
            }
            catch (error) {
                throw new Error("Unable to find users");
            }
        });
    }
    getAllUsersWithoutAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user
                    .find({ role: { $ne: "Admin" } })
                    .select(["-password"]);
                if (!user) {
                    throw new Error("Unable to find users");
                }
                return user;
            }
            catch (error) {
                throw new Error("Unable to find users");
            }
        });
    }
    getUser(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user.findById(_id).select(["-password"]);
                if (!user) {
                    throw new Error("No logged in user account");
                }
                return user;
            }
            catch (error) {
                throw new Error("Unable to get user account");
            }
        });
    }
    find(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.user.find(props, null, {
                    sort: { createdAt: -1 },
                });
                if (!users) {
                    throw new Error(`Unable to find users with that props`);
                }
                return users;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    delete(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user.findByIdAndDelete(_id);
                if (!user) {
                    throw new Error("Unable to delete user account with that id");
                }
                return user;
            }
            catch (error) {
                throw new Error("Unable to delete user account");
            }
        });
    }
    adminDelete(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user
                    .findByIdAndDelete(_id)
                    .select(["-password"])
                    .exec();
                if (!user) {
                    throw new Error("Unable to delete user with that data");
                }
                return user;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    adminUpdate(_id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user
                    .findByIdAndUpdate(_id, {
                    role: role,
                }, { new: true })
                    .select(["-password"])
                    .exec();
                if (!user) {
                    throw new Error("Unable to update user with that data");
                }
                return user;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    adminFind(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.user.find(props).select(["-password"]).exec();
                if (!users) {
                    throw new Error("Unable to find users");
                }
                return users;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = UserService;
