const express = require("express");
const router = express.Router();

const colorController = require("../app/controllers/colorController");

router.get("/", colorController.getColors);

module.exports = router;
