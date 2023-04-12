const Product = require("../../models/Product");
const User = require("../../models/User");
const Category = require("../../models/Category");
const asyncHandle = require("../../middleware/asyncHandle");
const { ObjectId } = require("mongodb");
const uploadFile = require("../../config/cloudinary");
const cloudinary = require("cloudinary");
const fs = require("fs");
const DB_RESOURCE = require("../../base/enum");
const Thumbnail = require("../../models/Thumbnail");
const Size = require("../../models/Size");
const Color = require("../../models/Color");

const productController = {
    //[GET] -> /product
    getProductByFilter: asyncHandle(async (req, res, next) => {
        try {
            const { page } = req.query;
            const limit = page * DB_RESOURCE.LIMIT_RECORD;
            const skipRecords = (page - 1) * DB_RESOURCE.LIMIT_RECORD;

            const products = await Product.find().limit(limit).skip(skipRecords);
            const listProducts = [];

            if (products.length === 0)
                return res.status(200).json({
                    status: "Success",
                    message: "No data",
                    data: { listProducts },
                });

            for (let product of products) {
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
                product = { ...product._doc, thumbnails, sizes };
                listProducts.push(product);
            }

            res.status(200).json({
                status: "success",
                result: listProducts.length,
                data: { listProducts },
            });
        } catch (error) {
            return res.json(error);
        }
    }),

    //[POST] -> /product/create
    createProduct: asyncHandle(async (req, res, next) => {
        try {
            const { name, sizes, colors, category } = req.body;

            const productName = await Product.findOne({ name: name });

            const categoryRecord = await Category.findOne({ _id: category });

            if (!categoryRecord)
                return res.status(404).json({
                    status: "Falied",
                    message: "This category not found!",
                });

            if (productName)
                return res.status(400).json({
                    status: "falied",
                    message: "Name is taken!",
                });

            if (req.messageError)
                return res.status(500).json({
                    status: "failed",
                    message: req.messageError,
                });

            const uploader = async (path) => await uploadFile.uploads(path, "thumbnails");

            const thumbnails = [];
            const files = req.files;
            for (const file of files) {
                const { path } = file;
                const newPath = await uploader(path);
                const thumbnail = new Thumbnail({
                    ...newPath,
                });
                await thumbnail.save();
                thumbnails.push(thumbnail);
                fs.unlinkSync(path);
            }

            const product = new Product({
                ...req.body,
                thumbnails: thumbnails.map((thumbnail) => thumbnail._id),
                sizes: sizes.map((size) => JSON.parse(size)._id),
                colors: colors.map((color) => JSON.parse(color)._id),
                category: category,
            });
            await product.save();

            res.status(200).json({
                status: "success",
                data: { product },
            });
        } catch (error) {
            return res.status(500).json({
                status: "falied",
                message: error.message,
            });
        }
    }),

    //[PUT] -> /product/update/:id
    updateProduct: asyncHandle(async (req, res, next) => {
        try {
            const productId = ObjectId(req.params.id);
            const product = await Product.findOne({ _id: productId });
            const { sizes, colors } = req.body;

            if (!product) return res.status(404).json("Product not found");

            const uploader = async (path) => await uploadFile.uploads(path, "thumbnails");

            const thumbnails = [];

            const files = req.files;
            for (const file of files) {
                const { path } = file;
                const newPath = await uploader(path);
                const thumbnail = new Thumbnail({
                    ...newPath,
                });
                await thumbnail.save();
                thumbnails.push(thumbnail);
                fs.unlinkSync(path);
            }

            for (const thumbnailId of product.thumbnails) {
                const thumbnail = await Thumbnail.find({ _id: thumbnailId });
                await cloudinary.uploader.destroy(`thumbnails/${thumbnail.urlId}`);
            }

            await Product.updateOne(
                { _id: productId },
                {
                    ...req.body,
                    sizes: sizes.map((size) => JSON.parse(size)._id),
                    colors: colors.map((color) => JSON.parse(color)._id),
                    thumbnails: thumbnails.map((thumbnail) => thumbnail._id),
                }
            );

            res.status(200).json({
                status: "success",
                productId: productId,
                message: "Update product successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message,
            });
        }
    }),

    //[DELETE] -> /product/delete/:id
    deleteProduct: asyncHandle(async (req, res, next) => {
        try {
            const userId = req.userId;
            const productId = ObjectId(req.params.id);

            const user = await User.findById(userId);
            const product = await Product.findOne({ _id: productId });

            if (!user)
                return res.status(401).json({
                    status: "falied",
                    message: "You're not authenticated",
                });

            if (!product) return res.status(404).json("Product not found");

            await Product.delete({ _id: productId });

            res.status(200).json({
                status: "success",
                productId: productId,
                message: "Delete product successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message,
            });
        }
    }),

    //[GET] -> /product/:id
    getOneProduct: asyncHandle(async (req, res, next) => {
        try {
            const productId = ObjectId(req.params.id);

            const product = await Product.findOne({ _id: productId }).populate("category", "name");

            if (!product)
                return res.status(404).json({
                    status: "failed",
                    message: `No products found with id ${productId}`,
                    data: product,
                });

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

            res.status(200).json({
                status: "success",
                data: { ...product._doc, thumbnails, sizes, colors },
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message,
            });
        }
    }),

    //[PATCH] -> /product/restore/:id
    restoreProduct: asyncHandle(async (req, res, next) => {
        try {
            const userId = req.userId;
            const productId = req.params.id;

            const user = await User.findById(userId);
            const product = await Product.findDeleted({ _id: productId });

            if (!user) return res.status(401).json("You're not authenticated");

            if (!product) return res.status(404).json("Product not found");

            await Product.restore({ _id: productId });

            res.status(200).json({
                status: "success",
                productId: productId,
                message: "Restore product successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message,
            });
        }
    }),

    //[GET] -> /product/trash
    getTrashProduct: asyncHandle(async (req, res, next) => {
        try {
            const products = await Product.findDeleted();
            const listProducts = [];

            if (products.length === 0)
                return res.status(200).json({
                    status: "Success",
                    message: "No data",
                    data: { listProducts },
                });

            for (let product of products) {
                const category = await Category.findOne({ _id: product.categoryId });
                product = { ...product._doc, categoryName: category.name };
                listProducts.push(product);
            }

            res.status(200).json({
                status: "success",
                result: listProducts.length,
                data: { listProducts },
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message,
            });
        }
    }),

    //[GET] -> /product/category/:categoryId
    getProductsByCategoryId: asyncHandle(async (req, res, next) => {
        try {
            const categoryId = req.params.categoryId;

            const category = await Category.findOne({ _id: categoryId });
            if (!category)
                return res.status(404).json({
                    status: "Falied",
                    message: "This category not found!",
                });

            const products = await Product.find({ categoryId: categoryId });

            if (products.length === 0)
                return res.status(200).json({
                    status: "Success",
                    message: "No data",
                    data: { products },
                });

            res.status(200).json({
                status: "success",
                result: products.length,
                data: { products },
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message,
            });
        }
    }),
};

module.exports = productController;
