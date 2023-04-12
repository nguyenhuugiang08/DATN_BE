const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_delete = require("mongoose-delete");

const ThumbnailShema = new Schema(
    {
        url: { type: String, trim: true },
        urlId: { type: String, trim: true },
    },
    {
        timestamps: true,
    }
);

ThumbnailShema.plugin(mongoose_delete, { deletedAt: true });
ThumbnailShema.plugin(mongoose_delete, { overrideMethods: true });

module.exports = mongoose.model("Thumbnail", ThumbnailShema);
