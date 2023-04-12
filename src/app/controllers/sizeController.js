const Size = require("../../models/Size");
const asyncHandle = require("../../middleware/asyncHandle");

const sizeController = {
    //[GET]: /size
    getSizes: asyncHandle(async (req, res, next) => {
        try {
            const sizes = await Size.find();

            res.status(200).json({
                status: "success",
                result: sizes.length,
                data: { sizes },
            });
        } catch (error) {
            console.log(error);
        }
    }),
};

module.exports = sizeController;
