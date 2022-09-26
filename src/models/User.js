const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const mongoose_delete = require("mongoose-delete");

//biểu thứ chính quy check các filed trong db
const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const regexPhone = /^[0-9]{9,}$/;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        surname: { type: String, trim: true, required: true },
        email: {
            type: String,
            required: [true, "Email không được để trống"],
            trim: true,
            unique: true,
            match: [regexEmail, "Email không đúng định dạng"],
        },
        password: {
            type: String,
            trim: true,
            required: [true, "Password không được để trống"],
            minlength: [6, "Password phải có ít nhất 6 kí tự"],
        },
        phone: {
            type: String,
            match: [regexPhone, "SĐT phải có dạng..."],
            trim: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        isActive: {
            type: Boolean,
            enum: [true, false],
            default: false,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", function (next) {
    let user = this;
    bcrypt.hash(user.password, 10, function (error, hash) {
        if (error) {
            return next(error);
        } else {
            user.password = hash;
            next();
        }
    });
});

userSchema.plugin(mongoose_delete, { deletedAt: true });
userSchema.plugin(mongoose_delete, { overrideMethods: true });

module.exports = mongoose.model("User", userSchema);
