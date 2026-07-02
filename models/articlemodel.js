const { Schema, model } = require("mongoose");
const articleSchema = new Schema(
    {
        image: {
            type: String,
            required: true
        },

        content: {
            type: String,
            required: true
        },

        tags: [
            {
                type: String,
                trim: true
            }
        ],

        readTime: {
            type: String,
            default: "1 min read"
        }

    },
    {
        timestamps: true
    }
);

module.exports = model("Article", articleSchema);