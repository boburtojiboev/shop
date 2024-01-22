const express = require("express");
const router_bssr = express.Router();
const shopController = require("./controller/shopController");

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

router_bssr.get("/pruducts/menu", shopController.getMyShopData);

module.exports = router_bssr;