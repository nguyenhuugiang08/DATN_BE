const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_delete = require("mongoose-delete");

const ProductShema = new Schema(
    {
        name: { type: String, required: true, trim: true, unique: true },
        price: { type: Number, required: true },
        description: { type: String, required: true, trim: true },
        discount: { type: Number, default: 0, required: true },
        quantity: { type: Number, required: true },
        thumbnails: [{ type: Schema.Types.ObjectId, ref: "Thumbnail" }],
        sizes: [{ type: Schema.Types.ObjectId, ref: "Size" }],
        colors: [{ type: Schema.Types.ObjectId, ref: "Color" }],
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
        },
    },
    {
        timestamps: true,
    }
);

ProductShema.plugin(mongoose_delete, { deletedAt: true });
ProductShema.plugin(mongoose_delete, { overrideMethods: true });

module.exports = mongoose.model("Product", ProductShema);
