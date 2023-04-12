const productRouter = require("./product");
const authRouter = require("./auth");
const userRouter = require("./user");
const categoryRouter = require("./category");
const newsRouter = require("./news");
const orderRouter = require("./order");
const otherRouter = require("./others");
const sizeRouter = require("./size");
const colorRouter = require("./color");

function route(app) {
    app.use("/api/v1/product/", productRouter);
    app.use("/api/v1/auth/", authRouter);
    app.use("/api/v1/user/", userRouter);
    app.use("/api/v1/category/", categoryRouter);
    app.use("/api/v1/news/", newsRouter);
    app.use("/api/v1/order/", orderRouter);
    app.use("/api/v1", otherRouter);
    app.use("/api/v1/size", sizeRouter);
    app.use("/api/v1/color", colorRouter);
}

module.exports = route;
