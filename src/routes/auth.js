const express = require("express");
const router = express.Router();

const authController = require("../app/controllers/authController");
const { verifyRefeshToken, verifyAccessToken } = require("../middleware/verifyToken");
const checkAdmin = require("../middleware/verifyAdmin");

// REGISTER
router.post("/register", authController.register);

//LOGIN
router.post("/login", authController.login);

//REFESH TOKEN
router.post("/refresh", verifyRefeshToken, authController.requestRefreshToken);

//LOGOUT
router.post("/logout", authController.logout);

//Get Users
router.get("/", verifyAccessToken, checkAdmin, authController.getUsers);

module.exports = router;
1