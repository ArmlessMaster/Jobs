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
function adminPermissionMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // const bearer = req.headers.authorization;
        // if (!bearer || !bearer.startsWith("Bearer ")) {
        //   return next(new HttpException(401, "Unauthorised"));
        // }
        // const accessToken = bearer.split("Bearer ")[1].trim();
        // if (!accessToken) {
        //   return next(new HttpException(401, "Unauthorised"));
        // }
        // try {
        //   const payload: ITokenObject | jwt.JsonWebTokenError =
        //   await validateToken.validateAccessToken(accessToken);
        //   if (payload instanceof jwt.JsonWebTokenError) {
        //     return next(new HttpException(401, "Unauthorised"));
        //   }
        //   const account = await UserModel.findById(payload.id).exec();
        //   if (!account) {
        //     return next(new HttpException(401, "Unauthorised"));
        //   } else if (account.role !== "Admin" && account.role !== "Moderator") {
        //     return next(new HttpException(401, "Access is denied"));
        //   }
        //   return next();
        // } catch (error) {
        //   return next(new HttpException(401, "Unauthorised"));
        // }
    });
}
exports.default = adminPermissionMiddleware;
