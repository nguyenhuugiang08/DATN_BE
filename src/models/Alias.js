const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_delete = require("mongoose-delete");

const AliasSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Alias name is required"],
            trim: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

AliasSchema.plugin(mongoose_delete, { deletedAt: true });
AliasSchema.plugin(mongoose_delete, { overrideMethods: true });

module.exports = mongoose.model("Alias", AliasSchema);
