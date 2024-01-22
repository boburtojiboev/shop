const express = require("express");
const router_bssr = express.Router();
const shopController = require("./controller/shopController");
const productController = require("./controller/productController");
const {uploadProductImage} = require("./utils/upload-multer");

/********************************
 *         BSSR EJS             *
 ********************************/

// memberga dahldor
router_bssr.get("/signup", shopController.getSignupMyShop);
router_bssr.post("/signup", shopController.signupProcess);

router_bssr.get("/login", shopController.getLoginMyShop);
router_bssr.post("/login", shopController.loginProcess);

router_bssr.get("/logout", shopController.logout);

router_bssr.get("/check-me", shopController.checkSessions);

router_bssr.get("/products/menu", shopController.getMyShopData);
router_bssr.post("/products/create", 
    shopController.validateAuthShop,
    uploadProductImage.single("product_image"),
    productController.addNewProduct);
router_bssr.post("/products/edit/:id", productController.updateChosenProduct);

module.exports = router_bssr;