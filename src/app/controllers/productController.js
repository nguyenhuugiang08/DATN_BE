const Product = require("../../models/Product");
const User = require("../../models/User");
const Category = require("../../models/Category");
const asyncHandle = require("../../middleware/asyncHandle");
const { ObjectId } = require("mongodb");
const uploadFile = require("../../config/cloudinary");
const cloudinary = require("cloudinary");
const fs = require("fs");

const productController = {
    //[GET] -> /product
    getAllProduct: asyncHandle(async (req, res, next) => {
        try {
            const products = await Product.find();
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
            return res.json(error);
        }
    }),

    //[POST] -> /product/create
    createProduct: asyncHandle(async (req, res, next) => {
        try {
            const { name, sizes, colors, categoryName } = req.body;
            console.log(req.body);

            const productName = await Product.findOne({ name: name });

            if (!categoryName)
                return res.status(400).json({
                    status: "Falied",
                    message: "Missing category name",
                });

            const category = await Category.findOne({ name: categoryName });

            if (!category)
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

            const urls = [];

            const files = req.files;
            for (const file of files) {
                const { path } = file;
                const newPath = await uploader(path);
                urls.push(newPath);
                fs.unlinkSync(path);
            }

            const product = new Product({
                ...req.body,
                thumbnails: urls,
                categoryId: category._id,
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
            const { categoryName } = req.body;
            console.log(req.body);

            const category = await Category.findOne({ name: categoryName });
            const product = await Product.findOne({ _id: productId });

            if (!category)
                return res.status(404).json({
                    status: "Falied",
                    message: "This category not found!",
                });

            if (!product) return res.status(404).json("Product not found");

            const uploader = async (path) => await uploadFile.uploads(path, "thumbnails");

            const urls = [];

            const files = req.files;
            for (const file of files) {
                const { path } = file;
                const newPath = await uploader(path);
                urls.push(newPath);
                fs.unlinkSync(path);
            }

            for (const thumbnail of product.thumbnails) {
                await cloudinary.uploader.destroy(`thumbnails/${thumbnail.urlId}`);
            }

            await Product.updateOne(
                { _id: productId },
                { ...req.body, thumbnails: urls, categoryId: category._id }
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

            const product = await Product.findOne({ _id: productId });

            if (!product)
                return res.status(404).json({
                    status: "failed",
                    message: `No products found with id ${productId}`,
                    data: product,
                });

            const category = await Category.findOne({ _id: product.categoryId });

            res.status(200).json({
                status: "success",
                data: { ...product._doc, categoryName: category.name },
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
