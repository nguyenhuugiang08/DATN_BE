const asyncHandle = require("../../middleware/asyncHandle");
const Category = require("../../models/Category");
const Alias = require("../../models/Alias");

const categoryController = {
    //[GET] -> /category
    getAllCategory: asyncHandle(async (req, res, next) => {
        try {
            let categories = await Category.find();
            const listCategories = [];

            console.log(categories);

            if (categories.length === 0)
                return res.status(200).json({
                    status: "Success",
                    message: "No data",
                    data: { listCategories },
                });

            for (let category of categories) {
                const alias = await Alias.findOne({ _id: category.aliasId });
                category = { ...category._doc, aliasName: alias.name };
                listCategories.push(category);
            }

            return res.status(200).json({
                status: "Success",
                result: listCategories.length,
                data: { listCategories },
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    //[POST] -> /category/create
    createCategory: asyncHandle(async (req, res, next) => {
        try {
            const { name, aliasName } = req.body;

            if (!aliasName || !name)
                return res.status(404).json({
                    status: "Failed",
                    message: "Missing alias name or name",
                });

            const alias = await Alias.findOne({ name: aliasName });

            if (!alias)
                return res.status(404).json({
                    status: "Failed",
                    message: "Alias not found",
                });

            const newCategory = new Category({ name: name, aliasId: alias._id });

            const category = await newCategory.save();

            return res.status(200).json({
                status: " Success",
                message: "Create a category successfully",
                data: category,
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    //[DELETE] -> /category/delete/:id
    deleteCategory: asyncHandle(async (req, res, next) => {
        try {
            const id = req.params.id;

            const category = await Category.findOne({ _id: id });

            if (!category)
                return res.status(404).json({
                    status: "Failed",
                    message: "Category not found",
                });
            await Category.delete({ _id: id });

            return res.status(200).json({
                status: " Success",
                message: "Delete a category successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    //[PUT] -> /category/update/:id
    updateCategory: asyncHandle(async (req, res, next) => {
        try {
            const id = req.params.id;
            const { name, aliasName } = req.body;

            const category = await Category.findOne({ _id: id });
            const alias = await Alias.findOne({ name: aliasName });

            if (!category)
                return res.status(404).json({
                    status: "Failed",
                    message: "Category not found",
                });

            if (!name || !aliasName)
                return res.status(404).json({
                    status: "Failed",
                    message: "Missing name or aliasName",
                });

            if (!alias)
                return res.status(404).json({
                    status: "Failed",
                    message: "Alias not found",
                });

            const data = {
                ...req.body,
                aliasId: alias._id,
            };

            await Category.updateOne({ _id: id }, data);

            return res.status(200).json({
                status: " Success",
                message: "Update a category successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    //[PATCH] -> /category/restore/:id
    restoreCategory: asyncHandle(async (req, res, next) => {
        try {
            const id = req.params.id;

            const category = await Category.findOneDeleted({ _id: id });

            if (!category)
                return res.status(404).json({
                    status: "Failed",
                    message: "Category not found",
                });

            await Category.restore({ _id: id });

            return res.status(200).json({
                status: " Success",
                message: "Restore a category successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    //[GET] -> /category/trash
    getTrashCategory: asyncHandle(async (req, res, next) => {
        try {
            const categories = await Category.findDeleted();
            const listCategories = [];

            if (categories.length === 0)
                return res.status(200).json({
                    status: "Success",
                    message: "No data",
                    data: { listCategories },
                });

            for (let category of categories) {
                const alias = await Alias.findOne({ _id: category.aliasId });
                category = { ...category._doc, aliasName: alias.name };
                listCategories.push(category);
            }

            return res.status(200).json({
                status: "Success",
                result: categories.length,
                data: { listCategories },
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    //[GET] -> /category/alias/:aliasId
    getCategoryByAliasId: asyncHandle(async (req, res, next) => {
        try {
            const aliasId = req.params.aliasId;

            const categories = await Category.find({ aliasId: aliasId });

            const listCategories = [];

            if (categories.length === 0)
                return res.status(200).json({
                    status: "Success",
                    message: "No data",
                    data: { listCategories },
                });

            for (let category of categories) {
                const alias = await Alias.findOne({ _id: category.aliasId });
                category = { ...category._doc, aliasName: alias.name };
                listCategories.push(category);
            }

            return res.status(200).json({
                status: "Success",
                result: categories.length,
                data: { categories },
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    //[GET] -> /category/:id
    getCategoryById: asyncHandle(async (req, res, next) => {
        try {
            const id = req.params.id;

            const category = await Category.findOne({ _id: id });

            if (!category)
                return res.status(404).json({
                    status: "Failed",
                    message: "Category not found",
                });

            const alias = await Alias.findOne({ _id: category.aliasId });

            return res.status(200).json({
                status: "Success",
                data: { ...category._doc, aliasName: alias.name },
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),
};

module.exports = categoryController;
