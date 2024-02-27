const express = require("express");
const router = express.Router();
const memberController = require("./controller/memberController");
const productController = require("./controller/productController");
const shopController = require("./controller/shopController");
const eventController = require("./controller/eventController");


/********************************
 *         REST API             *
 ********************************/

// Member related routers
router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);
router.get("/check-me", memberController.checkMyAuthentication);
router.get(
  "/member/:id",
  memberController.retrieveAuthMember,
  memberController.getChosenMember
);

// Product related routers
router.post(
  "/productsall",
  memberController.retrieveAuthMember,
  productController.getProductsAllShops
);
router.post(
  "/products",
  memberController.retrieveAuthMember,
  productController.getAllProducts
);

router.get(
  "/products/:id",
  memberController.retrieveAuthMember,
  productController.getChosenProduct
);

// Shop related routers
router.get(
  "/shops",
  memberController.retrieveAuthMember,
  shopController.getShops
);

router.get(
  "/shops/:id",
  memberController.retrieveAuthMember,
  shopController.getChosenShop
);

// Event related routers
router.post(
  "/events",
  memberController.retrieveAuthMember,
  eventController.getEvents
);

router.get(
  "/events/:id",
  memberController.retrieveAuthMember,
  eventController.getChosenEvent
);


module.exports = router;