const express = require("express");
const router = express.Router();

const newsController = require("../app/controllers/newsController");
const { verifyAccessToken } = require("../middleware/verifyToken");
const checkAdmin = require("../middleware/verifyAdmin");
const upload = require("../middleware/uploadFile");

router.get("/trash", verifyAccessToken, checkAdmin, newsController.getTrashNews);
router.get("/:id", verifyAccessToken, newsController.getNewsById);
router.patch("/restore/:id", verifyAccessToken, checkAdmin, newsController.restoreNews);
router.delete("/delete/:id", verifyAccessToken, checkAdmin, newsController.deleteNews);
router.put(
    "/update/:id",
    verifyAccessToken,
    checkAdmin,
    upload.array("pictures"),
    newsController.updateNews
);
router.post(
    "/create",
    verifyAccessToken,
    checkAdmin,
    upload.array("pictures"),
    newsController.createNews
);
router.get("/", verifyAccessToken, newsController.getAllNews);

module.exports = router;
