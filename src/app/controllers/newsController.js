const asyncHandle = require("../../middleware/asyncHandle");
const News = require("../../models/News");
const uploadFile = require("../../config/cloudinary");
const cloudinary = require("cloudinary");
const fs = require("fs");
const { findOne } = require("../../models/News");

const newsController = {
    // [GET] -> /news
    getAllNews: asyncHandle(async (req, res, next) => {
        try {
            const news = await News.find();

            if (news.length === 0) {
                return res.status(200).json({
                    status: "Success",
                    message: "No data",
                });
            }

            return res.status(200).json({
                status: "Success",
                result: news.length,
                data: { news },
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    //[POST] -> /news/create
    createNews: asyncHandle(async (req, res, next) => {
        try {
            const uploader = async (path) => await uploadFile.uploads(path, "pictrues");

            const urls = [];

            const files = req.files;
            for (const file of files) {
                const { path } = file;
                const newPath = await uploader(path);
                urls.push(newPath);
                fs.unlinkSync(path);
            }

            const data = {
                ...req.body,
                pictures: urls,
            };

            const news = new News(data);

            await news.save();

            return res.status(200).json({
                status: "Success",
                message: "Create a news successfully",
                data: { news },
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    //[PUT] -> /news/update/:id
    updateNews: asyncHandle(async (req, res, next) => {
        try {
            const newsId = req.params.id;

            const news = await News.findOne({ _id: newsId });

            if (!news)
                return res.status(404).json({
                    status: "Failed",
                    message: "This news not found",
                });

            for (const picture of news.pictures) {
                await cloudinary.uploader.destroy(`pictrues/${picture.urlId}`);
            }

            const uploader = async (path) => await uploadFile.uploads(path, "pictrues");

            const urls = [];

            const files = req.files;
            for (const file of files) {
                const { path } = file;
                const newPath = await uploader(path);
                urls.push(newPath);
                fs.unlinkSync(path);
            }

            const data = {
                ...req.body,
                pictures: urls,
            };

            await News.updateOne({ _id: newsId }, data);

            return res.status(200).json({
                status: "Success",
                message: "Update a news successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    //[DELETE] -> /news/delete/:id
    deleteNews: asyncHandle(async (req, res, next) => {
        try {
            const id = req.params.id;

            const news = await News.findOne({ _id: id });

            if (!news)
                return res.status(404).json({
                    status: "Failed",
                    message: "This news not found",
                });

            await News.delete({ _id: id });

            return res.status(200).json({
                status: "Success",
                message: "Delete a news successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    //[PATCH] -> /news/restore/:id
    restoreNews: asyncHandle(async (req, res, next) => {
        try {
            const id = req.params.id;

            const news = await News.findOneDeleted({ _id: id });

            if (!news)
                return res.status(404).json({
                    status: "Failed",
                    message: "This news not found",
                });

            await News.restore({ _id: id });

            return res.status(200).json({
                status: "Success",
                message: "Restore a news successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    // [GET] -> /news/trash
    getTrashNews: asyncHandle(async (req, res, next) => {
        try {
            const news = await News.findDeleted();

            if (news.length === 0) {
                return res.status(200).json({
                    status: "Success",
                    message: "No data",
                });
            }

            return res.status(200).json({
                status: "Success",
                result: news.length,
                data: { news },
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    // [GET] -> /news/trash
    getNewsById: asyncHandle(async (req, res, next) => {
        try {
            const id = req.params.id;

            const news = await News.findOne({ _id: id });

            if (!news) {
                return res.status(404).json({
                    status: "Failed",
                    message: "This news not found",
                });
            }

            return res.status(200).json({
                status: "Success",
                result: news.length,
                data: news,
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),
};

module.exports = newsController;
