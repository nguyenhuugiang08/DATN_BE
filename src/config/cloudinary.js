//dotenv
require("dotenv").config();

const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

module.exports.uploads = (file, folder) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(
            file,
            (result) => {
                const id = result.public_id.split(`${folder}/`)[1];
                resolve({
                    url: result.url,
                    urlId: id,
                });
            },
            {
                resource_type: "auto",
                folder: folder,
            }
        );
    });
};
