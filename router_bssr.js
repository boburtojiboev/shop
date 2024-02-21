const express = require("express");
const router_bssr = express.Router();
const shopController = require("./controller/shopController");
const productController = require("./controller/productController");
const eventController = require("./controller/eventController");
const uploader_product = require("./utils/upload-multer")("products");
const upload_members = require("./utils/upload-multer")("members");
const uploader_events = require("./utils/upload-multer")("events");

/********************************
 *         BSSR EJS             *
 ********************************/

// memberga dahldor
router_bssr.get("/", shopController.home)
router_bssr.get("/signup", shopController.getSignupMyShop);
router_bssr.post("/signup", upload_members.single("shop_img"), shopController.signupProcess);

router_bssr.get("/login", shopController.getLoginMyShop);
router_bssr.post("/login", shopController.loginProcess);

router_bssr.get("/logout", shopController.logout);

router_bssr.get("/check-me", shopController.checkSessions);

router_bssr.get(
  "/products/menu",
  shopController.getMyShopProduct
);
router_bssr.post(
  "/products/create",
  shopController.validateAuthShop,
  uploader_product.array("product_images", 5),
  productController.addNewProduct
);
router_bssr.post(
  "/products/edit/:id",
  shopController.validateAuthShop,
  productController.updateChosenProduct
);

router_bssr.get("/events/menu", shopController.getMyShopEvents);

router_bssr.post(
  "/events/create",
  shopController.validateAuthShop,
  uploader_events.array("event_images", 5),
  eventController.addNewEvent
);

router_bssr.post(
  "/events/edit/:id",
  shopController.validateAuthShop,
  eventController.updateChosenEvent
);

router_bssr.get(
  "/all-shop",
  shopController.validateAdmin,
  shopController.getAllShops
);

router_bssr.post(
  "/all-shop/edit",
  shopController.validateAdmin,
  shopController.updateShopByAdmin
);

module.exports = router_bssr;
