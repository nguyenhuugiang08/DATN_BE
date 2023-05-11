const express = require("express");
const router = express.Router();

const orderController = require("../app/controllers/orderController");
const { verifyAccessToken } = require("../middleware/verifyToken");
const checkAmin = require("../middleware/verifyAdmin");
const upload = require("../middleware/uploadFile");

router.put("/change-status/:id", verifyAccessToken, orderController.changeStatusOrder);
router.get("/user-id", verifyAccessToken, orderController.getOrdersByUserId);
router.post("/create", verifyAccessToken, upload.array("thumbnails"), orderController.createOrder);
router.get("/", verifyAccessToken, checkAmin, orderController.getAllOrders);

module.exports = router;
