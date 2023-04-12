const DB_RESOURCE = require("../../base/resource");
const asyncHandle = require("../../middleware/asyncHandle");
const News = require("../../models/News");
const Product = require("../../models/Product");
const Thumbnail = require("../../models/Thumbnail");
const Size = require("../../models/Size");
const Color = require("../../models/Color");

const othersController = {
    search: asyncHandle(async (req, res, next) => {
        try {
            const keyword = req.query.keyword;

            const products = await Product.find({ name: { $regex: keyword, $options: "i" } });
            const news = await News.find({ title: { $regex: keyword, $options: "i" } });

            return res.status(200).json({
                status: "Success",
                data: {
                    products,
                    news,
                },
            });
        } catch (error) {
            return res.status(500).json({
                status: "Faild",
                message: error.message,
            });
        }
    }),

    home: asyncHandle(async (req, res, next) => {
        try {
            const bannerUrls = DB_RESOURCE.Banners;

            // Lấy ra các sản phẩm thuộc danh mục áo nam
            const shirtProducts = await Product.find({ category: DB_RESOURCE.shirtCategory });

            const listProducts = [];
            for (let product of shirtProducts) {
                product = await product.populate("category", "name");

                const thumbnails = await Thumbnail.find(
                    {
                        _id: { $in: product.thumbnails },
                    },
                    "url urlId -_id"
                );

                const sizes = await Size.find({
                    _id: { $in: product.sizes },
                });
                const colors = await Color.find({
                    _id: { $in: product.colors },
                });
                product = { ...product._doc, thumbnails, sizes, colors };
                listProducts.push(product);
            }

            return res.status(200).json({
                status: "Success",
                data: {
                    bannerUrls,
                    shirtProducts: listProducts,
                },
            });
        } catch (error) {
            return res.status(500).json({
                status: "Faild",
                message: error.message,
            });
        }
    }),
};

module.exports = othersController;
