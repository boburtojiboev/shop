const mongoose = require("mongoose");
const {
  board_id_enum_list,
  board_article_status_enum_list,
} = require("../lib/config");
const Schema = mongoose.Schema;

const boArticleSchema = new mongoose.Schema(
  {
    art_subject: { type: String, required: true },
    art_content: { type: String, required: true },
    art_image: { type: String, required: false },
    bo_id: {
      type: String,
      required: true,
      enum: {
        values: board_id_enum_list,
        message: "{Value} is not among permitted values",
      },
    },
    art_status: {
      type: String,
      required: false,
      default: "active",
      enum: {
        values: board_article_status_enum_list,
        message: "{Value} is not among permitted values",
      },
    },
    art_likes: { type: Number, required: false, default: 0 },
    art_views: { type: Number, required: false, default: 0 },
    mb_id: { type: Schema.Types.ObjectId, ref: "Member", required: true },
  },
  { timestamps: { createdAt: true } }
);

module.exports = mongoose.model("BoArticle", boArticleSchema);
