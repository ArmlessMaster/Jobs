"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TokenSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        default: false,
        ref: "Users"
    },
    refreshToken: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Tokens", TokenSchema);
