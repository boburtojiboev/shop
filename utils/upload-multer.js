const path = require("path");
const multer = require("multer");
const uuid = require("uuid");


const product_storage = multer.diskStorage ({
    destination: function (req, file, cb) {
        cb(null, "./uploads/products");
    },
    filename: function (req, file, cb) {
        console.log(file);
        const extention = path.parse(file.originalname).ext;
        const rendom_name = uuid.v4() + extention;
        cb(null, rendom_name);
    },
});
module.exports.uploadProductImage = multer ({storage: product_storage});