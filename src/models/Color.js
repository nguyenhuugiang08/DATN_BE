const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_delete = require("mongoose-delete");

const ColorShema = new Schema(
    {
        colorName: String,
        thumbnail: String,
    },
    {
        timestamps: true,
    }
);

ColorShema.plugin(mongoose_delete, { deletedAt: true });
ColorShema.plugin(mongoose_delete, { overrideMethods: true });

module.exports = mongoose.model("Color", ColorShema);
