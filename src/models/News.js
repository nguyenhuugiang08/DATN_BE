const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_delete = require("mongoose-delete");

const Picture = new Schema({
    url: { type: String, trim: true },
    urlId: { type: String, trim: true },
});

const NewsSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        content: {
            type: String,
            required: true,
        },
        pictures: [
            {
                type: Picture,
                trim: true,
                default: [],
            },
        ],
    },
    {
        timestamps: true,
    }
);

NewsSchema.plugin(mongoose_delete, { deletedAt: true });
NewsSchema.plugin(mongoose_delete, { overrideMethods: true });

module.exports = mongoose.model("New", NewsSchema);
