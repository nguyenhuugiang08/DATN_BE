const express = require("express");
const router = express.Router();

const authController = require("../app/controllers/authController");
const { verifyRefeshToken } = require("../middleware/verifyToken");

// REGISTER
router.post("/register", authController.register);

//LOGIN
router.post("/login", authController.login);

//REFESH TOKEN
router.post("/refresh", verifyRefeshToken, authController.requestRefreshToken);

//LOGOUT
router.post("/logout", authController.logout)

module.exports = router;
