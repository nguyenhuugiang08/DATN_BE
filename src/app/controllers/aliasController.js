const asyncHandle = require("../../middleware/asyncHandle");
const Alias = require("../../models/Alias");
const User = require("../../models/User");

const aliasController = {
    //[GET] -> /alias
    getAllAlias: asyncHandle(async (req, res, next) => {
        try {
            const userId = req.userId;

            const user = await User.findOne({ _id: userId });
            const alias = await Alias.find();

            if (!user)
                return res.status(404).json({
                    status: "Failed",
                    message: "You're not authenticated",
                });

            if (alias.length === 0)
                return res.status(404).json({
                    status: "Failed",
                    message: "Alias not found",
                });

            return res.status(200).json({
                status: "Success",
                ressult: alias.length,
                data: { alias },
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    //[POST] -> /alias/create
    createAlias: asyncHandle(async (req, res, next) => {
        try {
            const newAlias = new Alias(req.body);

            const alias = await newAlias.save();

            return res.status(200).json({
                status: "Success",
                message: "Create an alias successfully!",
                data: alias,
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    //[DELETE] -> /alias/delete/:id
    deleteAlias: asyncHandle(async (req, res, next) => {
        try {
            const aliasId = req.params.id;

            const alias = await Alias.findOne({ _id: aliasId });

            if (!alias)
                return res.status(404).json({
                    status: "Failed",
                    message: "Alias not found",
                });

            await alias.delete({ _id: aliasId });

            return res.status(200).json({
                status: "Success",
                message: "Delete alias successfully!",
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    //[PUT] -> /alias/update/:id
    updateAlias: asyncHandle(async (req, res, next) => {
        try {
            const aliasId = req.params.id;
            const { name } = req.body;

            const alias = await Alias.findOne({ _id: aliasId });

            if (!alias)
                return res.status(404).json({
                    status: "Failed",
                    message: "Alias not found",
                });

            if (!name)
                return res.status(404).json({
                    status: "Failed",
                    message: "Mising name!",
                });

            await Alias.updateOne({ _id: aliasId }, { name: name });

            return res.status(200).json({
                status: "Success",
                message: "Update alias successfully!",
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    //[PATCH] -> /alias/restore/:id
    restoreAlias: asyncHandle(async (req, res, next) => {
        try {
            const aliasId = req.params.id;

            const alias = await Alias.findOneDeleted({ _id: aliasId });

            if (!alias)
                return res.status(404).json({
                    status: "Failed",
                    message: "Alias not found",
                });

            await Alias.restore({ _id: aliasId });

            return res.status(200).json({
                status: "Success",
                message: "Restore alias successfully!",
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    //[GET] -> /alias/trash
    getTrashAlias: asyncHandle(async (req, res, next) => {
        try {
            const alias = await Alias.findDeleted();

            if (alias.length === 0)
                return res.status(404).json({
                    status: "failed",
                    message: "Product not found",
                });

            return res.status(200).json({
                status: "Success",
                ressult: alias.length,
                data: { alias },
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),
};

module.exports = aliasController;