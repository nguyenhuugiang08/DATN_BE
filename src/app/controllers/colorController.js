const Color = require("../../models/Color");
const asyncHandle = require("../../middleware/asyncHandle");

const colorController = {
    //[GET]: /color
    getColors: asyncHandle(async (req, res, next) => {
        try {
            const colors = await Color.find();

            res.status(200).json({
                status: "success",
                result: colors.length,
                data: { colors },
            });
        } catch (error) {
            console.log(error);
        }
    }),
};

module.exports = colorController;
