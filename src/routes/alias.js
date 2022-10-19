const express = require("express");
const router = express.Router();

const aliasController = require("../app/controllers/aliasController");
const checkAdmin = require("../middleware/verifyAdmin");
const { verifyAccessToken } = require("../middleware/verifyToken");

router.get("/trash", verifyAccessToken, checkAdmin, aliasController.getTrashAlias);
router.patch("/restore/:id", verifyAccessToken, checkAdmin, aliasController.restoreAlias);
router.put("/update/:id", verifyAccessToken, checkAdmin, aliasController.updateAlias);
router.delete("/delete/:id", verifyAccessToken, checkAdmin, aliasController.deleteAlias);
router.post("/create", verifyAccessToken, checkAdmin, aliasController.createAlias);
router.get("/:id", aliasController.getAliasById);
router.get("/", aliasController.getAllAlias);

module.exports = router;
