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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const JobSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    priceFrom: {
        type: Number,
    },
    priceTo: {
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
        type: (Array),
        trim: true,
    },
}, {
    timestamps: true,
});
JobSchema.methods.isValid = function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (new Date(Date.now()) > this.validityDate) {
            this.isActive = false;
        }
    });
};
JobSchema.methods.isValidTop = function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (new Date(Date.now()) > this.topValidityDate) {
            this.isTop = false;
        }
    });
};
exports.default = (0, mongoose_1.model)("Jobs", JobSchema);
