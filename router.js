const express = require("express");
const router = express.Router();
const memberController = require("./controller/memberController");
const productControllerr = require("./controller/productController");

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
  "/products",
  memberController.retrieveAuthMember,
  productControllerr.getAllProducts
);

module.exports = router;