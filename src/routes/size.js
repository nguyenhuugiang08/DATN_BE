const express = require("express");
const router = express.Router();

const sizeController = require("../app/controllers/sizeController");

router.get("/", sizeController.getSizes);

module.exports = router;


