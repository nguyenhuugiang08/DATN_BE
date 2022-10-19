const express = require("express");
const router = express.Router();

const othersController = require("../app/controllers/othersController");

router.get("/search", othersController.search);
router.get("/home", othersController.home);

module.exports = router;