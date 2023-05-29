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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const model_1 = __importDefault(require("../tokens/model"));
const model_2 = __importDefault(require("../jobs/model"));
const generatePasswordHash_1 = __importDefault(require("../../utils/hashPassword/generatePasswordHash"));
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        validate: [validator_1.default.isEmail, "Invalid email"],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
    },
    paymentKeys: {
        type: (Array),
        default: [],
    },
    allPaymentKeys: {
        type: (Array),
        default: [],
    },
}, {
    timestamps: true,
});
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            return next();
        }
        const hash = yield (0, generatePasswordHash_1.default)(this.password);
        this.password = hash;
        next();
    });
});
UserSchema.pre("findOneAndUpdate", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const update = Object.assign({}, this.getUpdate());
        if (update.password) {
            update.password = yield (0, generatePasswordHash_1.default)(update.password);
            this.setUpdate(update);
        }
    });
});
UserSchema.methods.isValidPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
UserSchema.post('findOneAndDelete', function (result, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield model_1.default.deleteMany({ user_id: result._id });
        yield model_2.default.deleteMany({ account_id: result._id });
        next();
    });
});
exports.default = (0, mongoose_1.model)("Users", UserSchema);
