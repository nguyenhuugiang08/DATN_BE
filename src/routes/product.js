const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../middleware/verifyToken");
const upload = require("../middleware/uploadFile");
const checkAdmin = require("../middleware/verifyAdmin");

const productController = require("../app/controllers/productController");

router.get("/discount", productController.getProductDiscount);
router.get("/category/:categoryId", productController.getProductsByCategoryId);
router.patch("/restore/:id", verifyAccessToken, checkAdmin, productController.restoreProduct);
router.delete("/delete/:id", verifyAccessToken, checkAdmin, productController.deleteProduct);
router.put(
    "/update/:id",
    verifyAccessToken,
    checkAdmin,
    upload.array("thumbnails"),
    productController.updateProduct
);
router.post(
    "/create",
    verifyAccessToken,
    checkAdmin,
    upload.array("thumbnails"),
    productController.createProduct
);
router.get("/trash", verifyAccessToken, checkAdmin, productController.getTrashProduct);
router.get("/:id", productController.getOneProduct);
router.get("/", productController.getProductByFilter);

module.exports = router;
