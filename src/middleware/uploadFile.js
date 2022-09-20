const multer = require("multer");

const storage = multer.diskStorage({});

// file validation
const filefilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/webp"
    ) {
        cb(null, true);
    } else {
        req.messageError = `Unsupport file forrmat ${file.mimetype}`;
        return cb(null, false, new Error(req.messageError));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: filefilter,
});

module.exports = upload;
