const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../middleware/verifyToken");

const userController = require("../app/controllers/userController");

router.get("/reset-password", userController.resetPassword);
router.post("/forgot-password", userController.forgotPassword);
router.get("/verify", userController.verifyUser);
router.get("/info", verifyAccessToken, userController.getInfoUser);
router.post("/change-password", verifyAccessToken, userController.changePassword);

module.exports = router;
