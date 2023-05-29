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
const model_2 = __importDefault(require("../users/model"));
const { ref, uploadBytes, getDownloadURL, deleteObject, } = require("firebase/storage");
const storage = require("../../firebase");
class JobService {
    constructor() {
        this.job = model_1.default;
        this.user = model_2.default;
    }
    randGen() {
        const abc = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let name = "";
        while (name.length < 50) {
            name += abc[Math.floor(Math.random() * abc.length)];
        }
        return name;
    }
    isValidUrl(urlString) {
        var urlPattern = new RegExp("^(https?:\\/\\/)?" +
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
            "((\\d{1,3}\\.){3}\\d{1,3}))" +
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
            "(\\?[;&a-z\\d%_.~+=-]*)?" +
            "(\\#[-a-z\\d_]*)?$", "i");
        return !!urlPattern.test(urlString);
    }
    create(user_id, title, company, type, location, priceFrom, priceTo, link, experience, about, days, topDays, key, images, isTop) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user.findOne(user_id).exec();
                if (!user) {
                    throw new Error("Unable to create job");
                }
                const paymentKeys = user.paymentKeys;
                const allPaymentKeys = user.allPaymentKeys;
                if (paymentKeys.includes(key) || !allPaymentKeys.includes(key)) {
                    throw new Error("Unable to create job");
                }
                else {
                    yield this.user.findOneAndUpdate({ _id: user._id }, { $push: { paymentKeys: key } });
                }
                const imagesUrls = [];
                if (images && images.length > 0) {
                    yield Promise.all(images.map((file) => __awaiter(this, void 0, void 0, function* () {
                        const randomName = "☂" + this.randGen() + "☁";
                        const imageRef = ref(storage, randomName);
                        const metatype = {
                            contentType: file === null || file === void 0 ? void 0 : file.mimetype,
                            name: randomName,
                        };
                        yield uploadBytes(imageRef, file === null || file === void 0 ? void 0 : file.buffer, metatype)
                            .then((snapshot) => { })
                            .catch((error) => {
                            throw new Error(error.message);
                        });
                        yield getDownloadURL(ref(storage, randomName))
                            .then((url) => {
                            imagesUrls.push(url);
                        })
                            .catch((error) => {
                            throw new Error(error.message);
                        });
                    })));
                }
                const isActive = true;
                const validityDate = new Date();
                const topValidityDate = new Date();
                validityDate.setDate(validityDate.getDate() + days);
                if (isTop) {
                    topValidityDate.setDate(topValidityDate.getDate() + topDays);
                }
                const job = yield this.job.create({
                    user_id,
                    title,
                    company,
                    type,
                    location,
                    priceFrom,
                    priceTo,
                    link,
                    experience,
                    about,
                    isActive,
                    validityDate,
                    imagesUrls,
                    isTop,
                    topValidityDate,
                });
                return job;
            }
            catch (error) {
                throw new Error("Unable to create job");
            }
        });
    }
    update(_id, title, company, type, location, priceFrom, priceTo, link, experience, about, isActive, imagesUrls, images) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobEx = yield this.job.findById(_id).exec();
                if (!jobEx) {
                    throw new Error("Unable to update job");
                }
                if (!imagesUrls) {
                    imagesUrls = jobEx.imagesUrls;
                }
                if (images && images.length > 0) {
                    yield Promise.all(images.map((file) => __awaiter(this, void 0, void 0, function* () {
                        const randomName = "☂" + this.randGen() + "☁";
                        const imageRef = ref(storage, randomName);
                        const metatype = {
                            contentType: file === null || file === void 0 ? void 0 : file.mimetype,
                            name: randomName,
                        };
                        yield uploadBytes(imageRef, file === null || file === void 0 ? void 0 : file.buffer, metatype)
                            .then((snapshot) => { })
                            .catch((error) => {
                            throw new Error(error.message);
                        });
                        yield getDownloadURL(ref(storage, randomName))
                            .then((url) => {
                            imagesUrls.push(url);
                        })
                            .catch((error) => {
                            throw new Error(error.message);
                        });
                    })));
                }
                const job = new Date(Date.now()) < jobEx.validityDate
                    ? yield this.job.findByIdAndUpdate({ _id }, {
                        title: title,
                        company: company,
                        type: type,
                        location: location,
                        priceFrom: priceFrom,
                        priceTo: priceTo,
                        link: link,
                        experience: experience,
                        about: about,
                        isActive: isActive,
                        imagesUrls: imagesUrls,
                    })
                    : yield this.job.findByIdAndUpdate({ _id }, {
                        title: title,
                        company: company,
                        type: type,
                        location: location,
                        priceFrom: priceFrom,
                        priceTo: priceTo,
                        link: link,
                        experience: experience,
                        about: about,
                        imagesUrls: imagesUrls,
                    });
                if (!job) {
                    throw new Error("Unable to update job with that data");
                }
                return job;
            }
            catch (error) {
                throw new Error("Unable to update job");
            }
        });
    }
    renewal(user, _id, days, key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const current_user = yield this.user.findOne({
                    _id: user._id,
                });
                if (!current_user) {
                    throw new Error("Unable to find this user");
                }
                const current_job = yield this.job.findById(_id);
                if (!current_job) {
                    throw new Error("Unable to renewal this job");
                }
                const paymentKeys = current_user.paymentKeys;
                const allPaymentKeys = current_user.allPaymentKeys;
                if (paymentKeys.includes(key) || !allPaymentKeys.includes(key)) {
                    throw new Error("Unable to renew");
                }
                else {
                    yield this.user.findOneAndUpdate({ _id: user._id }, { $push: { paymentKeys: key } });
                }
                let newRevenueDate = new Date();
                if (current_job.validityDate) {
                    if (new Date(Date.now()) < current_job.validityDate) {
                        newRevenueDate = current_job.validityDate;
                    }
                    else {
                        newRevenueDate = new Date(Date.now());
                    }
                }
                newRevenueDate.setDate(newRevenueDate.getDate() + days);
                const plr = yield this.job.findByIdAndUpdate(_id, { $set: { validityDate: newRevenueDate, isActive: true } }, { new: true });
                if (!plr) {
                    throw new Error("Unable to renew with that data");
                }
                return plr;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    top(user, _id, days, key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const current_user = yield this.user.findOne({
                    _id: user._id,
                });
                if (!current_user) {
                    throw new Error("Unable to find this user");
                }
                const current_job = yield this.job.findById(_id);
                const topJobs = yield this.job.countDocuments({ isTop: true });
                if (topJobs >= 10) {
                    throw new Error("Unable to top more than 10 jobs");
                }
                if (!current_job) {
                    throw new Error("Unable to top this job");
                }
                const paymentKeys = current_user.paymentKeys;
                const allPaymentKeys = current_user.allPaymentKeys;
                if (paymentKeys.includes(key) || !allPaymentKeys.includes(key)) {
                    throw new Error("Unable to top");
                }
                else {
                    yield this.user.findOneAndUpdate({ _id: user._id }, { $push: { paymentKeys: key } });
                }
                let newTopDate = new Date();
                if (current_job.topValidityDate) {
                    if (new Date(Date.now()) < current_job.topValidityDate) {
                        newTopDate = current_job.topValidityDate;
                    }
                    else {
                        newTopDate = new Date(Date.now());
                    }
                }
                newTopDate.setDate(newTopDate.getDate() + days);
                const plr = yield this.job.findByIdAndUpdate(_id, { $set: { topValidityDate: newTopDate, isTop: true } }, { new: true });
                if (!plr) {
                    throw new Error("Unable to top with that data");
                }
                return plr;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    get(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield this.job
                    .find({ user_id: user_id })
                    .sort({ isActive: -1 });
                jobs.forEach((job) => {
                    job.isValid();
                    job.isValidTop();
                    job.save();
                });
                if (!jobs) {
                    throw new Error("Unable to get jobs");
                }
                return jobs;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    find(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield this.job
                    .find(props, null, { sort: { isTop: -1, createdAt: -1 } })
                    .limit(props.limit)
                    .populate({
                    path: "user_id",
                    populate: { path: "_id" },
                })
                    .select(["-password"])
                    .exec();
                jobs.forEach((job) => {
                    job.isValid();
                    job.isValidTop();
                    job.save();
                });
                yield Promise.all(jobs.map((item) => __awaiter(this, void 0, void 0, function* () {
                    let boolean = false;
                    item.imagesUrls.map((item) => {
                        if (!(item.indexOf("firebase") >= 0 &&
                            item.indexOf("%E2%98%82") >= 0 &&
                            item.indexOf("%E2%98%81") >= 0)) {
                            boolean = true;
                        }
                    });
                    if (boolean) {
                        const _id = item._id;
                        yield this.delete(_id);
                    }
                })));
                if (!jobs) {
                    throw new Error("Unable to find jobs with that data");
                }
                return jobs;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    findNotMy(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield this.job
                    .find(Object.assign(Object.assign({}, props), { user_id: { $ne: props.user_id }, sort: { isTop: -1, createdAt: -1 } }))
                    .sort({ isTop: -1, createdAt: -1 })
                    .limit(props.limit)
                    .populate({
                    path: "user_id",
                    populate: { path: "_id" },
                })
                    .select(["-password"])
                    .exec();
                jobs.forEach((job) => {
                    job.isValid();
                    job.isValidTop();
                    job.save();
                });
                yield Promise.all(jobs.map((item) => __awaiter(this, void 0, void 0, function* () {
                    let boolean = false;
                    item.imagesUrls.map((item) => {
                        if (!(item.indexOf("firebase") >= 0 &&
                            item.indexOf("%E2%98%82") >= 0 &&
                            item.indexOf("%E2%98%81") >= 0)) {
                            boolean = true;
                        }
                    });
                    if (boolean) {
                        const _id = item._id;
                        yield this.delete(_id);
                    }
                })));
                if (!jobs) {
                    throw new Error("Unable to find jobs with that data");
                }
                return jobs;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    adminFind(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield this.job
                    .find({ _id: _id })
                    .populate({
                    path: "user_id",
                    populate: { path: "_id" },
                })
                    .select(["-password"])
                    .exec();
                jobs.forEach((job) => {
                    job.isValid();
                    job.isValidTop();
                    job.save();
                });
                if (!jobs) {
                    throw new Error("Unable to find jobs with that data");
                }
                return jobs;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    adminGet() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield this.job
                    .find({})
                    .populate({
                    path: "user_id",
                    populate: { path: "_id" },
                })
                    .select(["-password"])
                    .exec();
                jobs.forEach((job) => {
                    job.isValid();
                    job.isValidTop();
                    job.save();
                });
                if (!jobs) {
                    throw new Error("Unable to find jobs with that data");
                }
                return jobs;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    delete(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = (yield this.job.findById(_id));
                if (!jobs) {
                    throw new Error("Unable to find job with that data");
                }
                if (jobs.imagesUrls && jobs.imagesUrls.length > 0) {
                    yield Promise.all(jobs.imagesUrls.map((image) => __awaiter(this, void 0, void 0, function* () {
                        if (this.isValidUrl(image) &&
                            image.indexOf("firebase") >= 0 &&
                            image.indexOf("%E2%98%82") >= 0 &&
                            image.indexOf("%E2%98%81") >= 0) {
                            const deletePic = "☂" + image.split("%E2%98%82")[1].split("%E2%98%81")[0] + "☁";
                            const deleteRef = ref(storage, deletePic);
                            const result = yield deleteObject(deleteRef)
                                .then(() => {
                                return true;
                            })
                                .catch((error) => {
                                throw new Error(error.message);
                            });
                        }
                    })));
                }
                const job = yield this.job.findOneAndDelete({ _id }).populate({
                    path: "user_id",
                    populate: { path: "_id" },
                });
                if (!job) {
                    throw new Error("Unable to delete job with that data");
                }
                return job;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    deleteImage(_id, url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletePic = "☂" + url.split("%E2%98%82")[1].split("%E2%98%81")[0] + "☁";
                const deleteRef = ref(storage, deletePic);
                const result = yield deleteObject(deleteRef)
                    .then(() => {
                    return true;
                })
                    .catch((error) => {
                    throw new Error(error.message);
                });
                let jobs = (yield this.job.findById(_id));
                if (!jobs) {
                    throw new Error("Unable to find clothes with that data");
                }
                if (jobs.imagesUrls.includes(url)) {
                    jobs = (yield this.job.findByIdAndUpdate(_id, { $pullAll: { imagesUrls: [url] } }, { new: true }));
                }
                return jobs;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = JobService;
