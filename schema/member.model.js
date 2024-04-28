const mongoose = require("mongoose");
const { member_status_enums, member_type_enums, ordernary_enums } = require("../lib/config");

const memberSchema = new mongoose.Schema({
    mb_nick: {
        type: String,
        required: true,
        index: {unique: true, sparse: true}
    },
    mb_phone: {
        type: Number,
        required: true,
        index: {unique: true, sparse: true}
    },
    mb_password: {
        type: String,
        required: true,
        select: false

    },
    mb_type: {
        type: String,
        required: false,
        default: "USER",
        enum: {
            values: member_type_enums,
            message: "{VALUE} is not among permitted values"
        }
    },
    mb_status: {
        type: String,
        required: false,
        default: "ACTIVE",
        enum: {
            values: member_status_enums,
            message: "{VALUE} is not among permitted values"
        }
    },
    mb_address: {
        type: String,
        required: false,
    },
    mb_description: {
        type: String,
        required: false
    },
    mb_image: {
        type: String,
        required: false,
    },
    mb_point: {
        type: Number,
        require: false,
        default: 0
    },
    mb_top: {
        type: String,
        required: false,
        default: 'N',
        enum: {
            values: ordernary_enums,
            message: "{VALUE} is not among permitted values"
        }
    },
    mb_views: {
        type: Number,
        required: false,
        default: 0
    },
    mb_likes: {
        type: Number,
        required: false,
        default: 0
    },
    mb_follow_cnt: {
        type: Number,
        required: false,
        default: 0
    },
    mb_subscriber_cnt: {
        type: Number,
        required: false,
        default: 0
    }, 
    
}, 
    {timestamps: true}
);

module.exports = mongoose.model("Member", memberSchema);