const DB_RESOURCE = require("../../base/resource");
const asyncHandle = require("../../middleware/asyncHandle");
const News = require("../../models/News");
const Product = require("../../models/Product");
const Thumbnail = require("../../models/Thumbnail");
const Size = require("../../models/Size");
const Color = require("../../models/Color");

const handlePopulateProduct = async (listResult, listInput) => {
    for (let product of listInput) {
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
        listResult.push(product);
    }
    return listResult;
};

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
            // Lấy ra các sản phẩm thuộc danh mục quần nam
            const trousersProducts = await Product.find({ category: DB_RESOURCE.trousersCategory });

            let listshirtProducts = [];
            listshirtProducts = await handlePopulateProduct(listshirtProducts, shirtProducts);

            let listTrousersProducts = [];
            listTrousersProducts = await handlePopulateProduct(
                listTrousersProducts,
                trousersProducts
            );

            return res.status(200).json({
                status: "Success",
                data: {
                    bannerUrls,
                    shirtProducts: listshirtProducts,
                    trousersProducts: listTrousersProducts,
                    homeBasic: DB_RESOURCE.HomeBasic,
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
