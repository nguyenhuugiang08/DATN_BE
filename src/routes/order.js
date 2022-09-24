const express = require("express");
const router = express.Router();

const orderController = require("../app/controllers/orderController");
const { verifyAccessToken } = require("../middleware/verifyToken");
const checkAmin = require("../middleware/verifyAdmin");

router.post("/create", verifyAccessToken, orderController.createOrder);
router.get("/", verifyAccessToken, checkAmin, orderController.getAllOrders);

module.exports = router;
