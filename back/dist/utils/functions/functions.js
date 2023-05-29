"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomString = void 0;
function generateRandomString(length) {
    const abc = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let name = '';
    while (name.length < length) {
        name += abc[Math.floor(Math.random() * abc.length)];
    }
    return name;
}
exports.generateRandomString = generateRandomString;
