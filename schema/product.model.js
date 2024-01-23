const mongoose = require("mongoose");
const {
  product_collection_enums,
  product_status_enums,
  product_size_enums,
  product_colors_enums,
} = require("../lib/config");

const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    product_collection: {
      type: String,
      required: true,
      enum: {
        values: product_collection_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    product_status: {
      type: String,
      required: false,
      default: "PAUSED",
      enum: {
        values: product_status_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_discount: {
      type: Number,
      required: false,
      default: 0,
    },
    product_left_cnt: {
      type: Number,
      required: true,
    },
    product_size: {
      type: Number,
      default: 270,
      required: true,
      enum: {
        values: product_size_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    product_colors: {
      type: String,
      default: "white",
      required: true,
      enum: {
        values: product_colors_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    product_description: {
      type: String,
      required: true,
    },

    product_images: {
      type: Array,
      required: false,
      default: [],
    },

    product_likes: {
      type: Number,
      required: false,
      default: 0,
    },
    product_views: {
      type: Number,
      required: false,
      default: 0,
    },
    shop_mb_id: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: false,
    },
  },
  { timestamps: true }
); //createAt, updateAt;

productSchema.index(
  { shop_mb_id: 1, product_name: 1, product_size: 1, product_colors: 1 },
  { unique: true }
);

module.exports = mongoose.model(("Product", productSchema));
