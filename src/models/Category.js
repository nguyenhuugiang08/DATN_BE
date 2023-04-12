const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_delete = require("mongoose-delete");

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

CategorySchema.plugin(mongoose_delete, { deletedAt: true });
CategorySchema.plugin(mongoose_delete, { overrideMethods: true });

module.exports = mongoose.model("Category", CategorySchema);
