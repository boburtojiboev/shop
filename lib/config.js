exports.member_type_enums = ["USER", "ADMIN", "PEDAL", "SHOP"];
exports.member_status_enums = ["ONPAUSE", "ACTIVE", "DELETED",];
exports.ordernary_enums = ["Y", "N"];

exports.product_collection_enums = ["MEN", "WOMEN", "KIDS",];
exports.product_status_enums = ["PAUSED", "PROCESS", "DELETED"];
exports.product_size_enums = [230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285];
exports.product_colors_enums = ["white", "black", "red", "green", "yellow", "blue"];


/**********************************
 *     MONGODB RELETED COMANDS    *
 **********************************/

exports.shapeIntoMongooseObjectId = (target) => {
    if(typeof target === 'string') {
        return new mongoose.Types.ObjectId(target);
    } else return target;
};