const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_delete = require("mongoose-delete");

const Product = new Schema({
    _id: { type: Schema.Types.ObjectId, ref: "products" },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    total: { type: Number, required: true, default: 0 },
});

const OrderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        note: {
            type: String,
        },
        products: [
            {
                type: Product,
                required: true,
            },
        ],
        city: {
            type: String,
        },
        district: {
            type: String,
        },
        sumMoney: {
            type: Number,
            required: true,
            default: 0,
        },
        status: {
            type: String,
            enum: [
                "Chờ xác nhận",
                "Chờ lấy hàng",
                "Đang giao",
                "Đã giao",
                "Đã hủy",
                "Đã thanh toán",
            ],
            default: "Chờ xác nhận",
        },
    },
    {
        timestamps: true,
    }
);

OrderSchema.plugin(mongoose_delete, { deletedAt: true });
OrderSchema.plugin(mongoose_delete, { overrideMethods: true });

module.exports = mongoose.model("Order", OrderSchema);
