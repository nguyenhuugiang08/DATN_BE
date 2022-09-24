const express = require("express");
const router = express.Router();

const categoryController = require("../app/controllers/categoryController");
const { verifyAccessToken } = require("../middleware/verifyToken");
const checkAdmin = require("../middleware/verifyAdmin");

router.get("/alias/:aliasId", categoryController.getCategoryByAliasId);
router.get("/trash", verifyAccessToken, checkAdmin, categoryController.getTrashCategory);
router.get("/:id", categoryController.getCategoryById);
router.patch("/restore/:id", verifyAccessToken, checkAdmin, categoryController.restoreCategory);
router.put("/update/:id", verifyAccessToken, checkAdmin, categoryController.updateCategory);
router.delete("/delete/:id", verifyAccessToken, checkAdmin, categoryController.deleteCategory);
router.post("/create", verifyAccessToken, checkAdmin, categoryController.createCategory);
router.get("/", categoryController.getAllCategory);

module.exports = router;
