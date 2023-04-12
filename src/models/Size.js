const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_delete = require("mongoose-delete");

const SizeShema = new Schema(
    {
        sizeName: String,
    },
    {
        timestamps: true,
    }
);

SizeShema.plugin(mongoose_delete, { deletedAt: true });
SizeShema.plugin(mongoose_delete, { overrideMethods: true });

module.exports = mongoose.model("Size", SizeShema);
