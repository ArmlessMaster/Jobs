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
const nodemailer = require("nodemailer");
class MailService {
    sendActivationMail(to, link) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMPT_HOST,
                    port: process.env.SMPT_PORT,
                    secure: false,
                    auth: {
                        user: process.env.SMPT_USER,
                        pass: process.env.SMPR_PASWWORD,
                    }
                });
                yield transporter.sendMail({
                    from: process.env.SMPT_USER,
                    to,
                    subject: "Activating an account on the site " + process.env.API_URL,
                    html: `
              <head>
              <title>Account confirmation</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f6f6f6;
                }
                .container {
                  width: 80%;
                  margin: auto;
                  background-color: #fff;
                  padding: 20px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  text-align: center;
                }
                h1 {
                  color: #333;
                  font-size: 24px;
                  margin-top: 0;
                  margin-bottom: 20px;
                  text-align: center;
                }
                p {
                  font-size: 16px;
                  line-height: 1.5;
                  margin-bottom: 20px;
                }
                .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #fff;
                  color: blue;
                  text-decoration: none;
                  border-radius: 4px;
                  font-size: 16px;
                  outline:none;
                  border: 1px solid;
                  cursor: pointer;
                }
                a{
                  color: white;
                  text-decoration: none;
                }
                .ii {
                  color: white;
                  text-decoration: none;
                }
              </style>
              </head>
              <body>
                <div class="container">
                  <h1>Account confirmation</h1>
                  <p>To confirm your account, please click on the button below</p>
                  <a href="${link}" class="button">Confirm</a>
                </div>
              </body>
            `
                });
            }
            catch (error) {
                throw new Error("Error");
            }
        });
    }
}
exports.default = MailService;
