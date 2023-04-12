const asyncHandle = require("../../middleware/asyncHandle");
const Category = require("../../models/Category");

const categoryController = {
    //[GET] -> /category
    getAllCategory: asyncHandle(async (req, res, next) => {
        try {
            let categories = await Category.find();

            if (categories.length === 0)
                return res.status(200).json({
                    status: "Success",
                    message: "No data",
                    data: { listCategories },
                });

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

    //[POST] -> /category/create
    createCategory: asyncHandle(async (req, res, next) => {
        try {
            const { name } = req.body;

            const newCategory = new Category({ name: name });

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
            const { name } = req.body;

            const category = await Category.findOne({ _id: id });

            if (!category)
                return res.status(404).json({
                    status: "Failed",
                    message: "Category not found",
                });

            const data = {
                ...req.body,
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
            console.log(categories);

            if (categories.length === 0)
                return res.status(200).json({
                    status: "Success",
                    message: "No data",
                    data: { categories },
                });

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

            return res.status(200).json({
                status: "Success",
                data: { ...category._doc },
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
