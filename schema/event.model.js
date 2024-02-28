const mongoose = require("mongoose");
const { event_status_enums } = require("../lib/config");

const Schema = mongoose.Schema;

const eventSchema = new mongoose.Schema(
  {
    event_name: { type: String, required: true },
    event_status: {
      type: String,
      required: false,
      default: "PAUSED",
      enum: {
        values: event_status_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    event_time: {
      type: String,
      required: true,
    },
    event_address: {
      type: String,
      required: true,
    },
    event_description: {
      type: String,
      required: true,
    },
    event_phone: {
      type: String,
      required: true,
      index: { unique: true, sparse: true },
    },

    event_images: {
      type: Array,
      required: false,
      default: [],
    },

    event_likes: {
      type: Number,
      required: false,
      default: 0,
    },
    event_views: {
      type: Number,
      required: false,
      default: 0,
    },
    event_comment: {
      type: Number,
      required: false,
      default: 0,
    },
    shop_mb_id: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: false,
    },
    shop_mb_name: {
      type: Schema.Types.String,
      ref: "Member",
      required: false,
    },
  },
  { timestamps: true }
); //createAt, updateAt;

eventSchema.index({ shop_mb_id: 1, event_name: 1 }, { unique: true });

module.exports = mongoose.model("Event", eventSchema);
