"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("module-alias/register");
const app_1 = __importDefault(require("./app"));
const controller_1 = __importDefault(require("./models/users/controller"));
const controller_2 = __importDefault(require("./models/jobs/controller"));
const validate_1 = require("./utils/validate");
(0, validate_1.validateEnv)();
const app = new app_1.default([new controller_1.default(), new controller_2.default()], Number(process.env.PORT));
app.listen();
