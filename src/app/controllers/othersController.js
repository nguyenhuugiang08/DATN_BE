const asyncHandle = require("../../middleware/asyncHandle");
const Category = require("../../models/Category");
const News = require("../../models/News");
const Product = require("../../models/Product");

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
            const bannerUrls = [
                "https://bizweb.dktcdn.net/100/448/042/themes/876420/assets/slider_1.jpg?1666084718503",
                "https://bizweb.dktcdn.net/100/448/042/themes/876420/assets/slider_2.jpg?1666084718503",
            ];

            //get news limit 6 documents
            const news = await News.find().limit(6);

            // get all products have discount is 50
            const flashSaleProducts = await Product.find({ discount: "50" }).limit(5);

            // get all products'category is "Đồ thể thao" and limit 5 documents
            const sportsCategory = await Category.findOne({ name: "Đồ thể thao" });
            let sportsProducts = [];
            if (sportsCategory) {
                const products = await Product.find({ categoryId: sportsCategory?._id }).limit(5);
                sportsProducts = [...products];
            }

            // get all products'
            const swimCategory = await Category.findOne({ name: "Đồ bơi" });
            let swimProducts = [];
            if (swimCategory) {
                const products = await Product.find({ categoryId: swimCategory?._id }).limit(5);
                swimProducts = [...products];
            }

            // get product spring collection
            const springCategory = await Category.findOne({ name: "Hoa cỏ mùa xuân" });
            let springProducts = [];
            if (springCategory) {
                const products = await Product.find({ categoryId: springCategory?._id }).limit(10);
                springProducts = [...products];
            }
            // get product summer collection
            const summerCategory = await Category.findOne({ name: "Bộ sưu tập mùa hè" });
            let summerProducts = [];
            if (summerCategory) {
                const products = await Product.find({ categoryId: summerCategory?._id }).limit(10);
                summerProducts = [...products];
            }
            // get product winter collection
            const winterCategory = await Category.findOne({ name: "Hoa cỏ mùa đông" });
            let winterProducts = [];
            if (winterCategory) {
                const products = await Product.find({ categoryId: winterCategory?._id }).limit(10);
                winterProducts = [...products];
            }

            // get categories which are feature categories
            const dressCategory = await Category.findOne({ name: "Đầm" });
            let dressProducts = [];
            if (dressCategory) {
                const products = await Product.find({ categoryId: dressCategory?._id });
                dressProducts = [...products];
            }

            const vestCategory = await Category.findOne({ name: "Vest-Blazer" });
            let vestProducts = [];
            if (vestCategory) {
                const products = await Product.find({ categoryId: vestCategory?._id });
                vestProducts = [...products];
            }

            const sleepCategory = await Category.findOne({ name: "Đồ ngủ" });
            let sleepProducts = [];
            if (sleepCategory) {
                const products = await Product.find({ categoryId: sleepCategory?._id });
                sleepProducts = [...products];
            }

            const shirtCategory = await Category.findOne({ name: "Vest-Blazer" });
            let shirtProducts = [];
            if (shirtCategory) {
                const products = await Product.find({ categoryId: shirtCategory?._id });
                shirtProducts = [...products];
            }

            return res.status(200).json({
                status: "Success",
                data: {
                    bannerUrls,
                    egaFashions: [
                        {
                            categoryName: "Đầm",
                            number: dressProducts.length,
                            thumbnail:
                                "https://bizweb.dktcdn.net/thumb/large/100/448/042/themes/876420/assets/season_coll_1_img.png?1666596948466",
                        },
                        {
                            categoryName: "Vest-Blazer",
                            number: vestProducts.length,
                            thumbnail:
                                "https://bizweb.dktcdn.net/thumb/large/100/448/042/themes/876420/assets/season_coll_2_img.png?1666596948466",
                        },
                        {
                            categoryName: "Đồ thể thao",
                            number: sportsProducts.length,
                            thumbnail:
                                "https://bizweb.dktcdn.net/thumb/large/100/448/042/themes/876420/assets/season_coll_3_img.png?1666596948466",
                        },
                        {
                            categoryName: "Đồ bơi",
                            number: swimProducts.length,
                            thumbnail:
                                "https://bizweb.dktcdn.net/thumb/large/100/448/042/themes/876420/assets/season_coll_4_img.png?1666596948466",
                        },
                        {
                            categoryName: "Đồ ngủ",
                            number: sleepProducts.length,
                            thumbnail:
                                "https://bizweb.dktcdn.net/thumb/large/100/448/042/themes/876420/assets/season_coll_5_img.png?1666596948466",
                        },
                        {
                            categoryName: "Áo sơ mi",
                            number: shirtProducts.length,
                            thumbnail:
                                "https://bizweb.dktcdn.net/thumb/large/100/448/042/themes/876420/assets/season_coll_6_img.png?1666596948466",
                        },
                    ],
                    news,
                    featuredProducts: [
                        { title: "Hàng hiệu -50%", data: flashSaleProducts },
                        { title: "Năng động ngày hè", data: sportsProducts },
                        { title: "Chào biển nắng mới", data: swimProducts },
                    ],
                    collections: [
                        { title: "Bộ sưu tập mùa xuân", data: springProducts },
                        { title: "Bộ sưu tập mùa hè", data: summerProducts },
                        { title: "Bộ sưu tập mùa đông", data: winterProducts },
                    ],
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
