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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const model_1 = __importDefault(require("./model"));
class TokenService {
    constructor() {
        this.token = model_1.default;
    }
    generateTokens(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "1d" });
                const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
                return { accessToken, refreshToken };
            }
            catch (error) {
                throw new Error("Unable to create token");
            }
        });
    }
    saveToken(user_id, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenData = yield this.token.findOne({ user_id: user_id });
                if (tokenData) {
                    tokenData.refreshToken = refreshToken;
                    tokenData.user_id = user_id;
                    return tokenData.save();
                }
                const token = yield this.token.create({ user_id, refreshToken });
                return token;
            }
            catch (error) {
                throw new Error("Unable to save token");
            }
        });
    }
    removeToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenData = yield this.token.deleteOne({ refreshToken });
                return tokenData;
            }
            catch (error) {
                throw new Error("Unable to remove token");
            }
        });
    }
    findToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenData = yield this.token.findOne({ refreshToken });
                return tokenData;
            }
            catch (error) {
                throw new Error("Unable to find token");
            }
        });
    }
}
exports.default = TokenService;
