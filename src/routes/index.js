const productRouter = require("./product");
const authRouter = require("./auth");
const userRouter = require("./user");
const aliasRouter = require("./alias");
const categoryRouter = require("./category");
const newsRouter = require("./news");
const orderRouter = require("./order");

function route(app) {
    app.use("/api/v1/product/", productRouter);
    app.use("/api/v1/auth/", authRouter);
    app.use("/api/v1/user/", userRouter);
    app.use("/api/v1/alias/", aliasRouter);
    app.use("/api/v1/category/", categoryRouter);
    app.use("/api/v1/news/", newsRouter);
    app.use("/api/v1/order/", orderRouter);
}

module.exports = route;
