const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_delete = require("mongoose-delete");

const Thumbnail = new Schema({
    url: { type: String, trim: true },
    urlId: { type: String, trim: true },
});

const ProductShema = new Schema(
    {
        trademark: { type: String, required: true, trim: true },
        name: { type: String, required: true, trim: true, unique: true },
        price: { type: Number, required: true },
        sizes: [
            {
                type: String,
                trim: true,
                required: true,
                default: [],
            },
        ],
        description: { type: String, required: true, trim: true },
        colors: [
            {
                type: String,
                trim: true,
                required: true,
                default: [],
            },
        ],
        discount: { type: Number, default: 0, required: true },
        quantity: { type: Number, required: true },
        thumbnails: [
            {
                type: Thumbnail,
                trim: true,
                default: [],
            },
        ],
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "categories",
        },
    },
    {
        timestamps: true,
    }
);

ProductShema.plugin(mongoose_delete, { deletedAt: true });
ProductShema.plugin(mongoose_delete, { overrideMethods: true });

module.exports = mongoose.model("Product", ProductShema);
