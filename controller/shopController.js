const Member = require("../models/Member");

let shopController = module.exports;

shopController.getMyShopData = async (req, res) => {
  try {
    console.log("GET: cont/getMyShopData");
    // todo get my shop product

    res.render("shop-menu");
  } catch (err) {
    console.log(`ERROR, cont/getMyShopData, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.getSignupMyShop = async (req, res) => {
  try {
    console.log("GET: cont/getSignupMyShop");
    res.render("signup");
  } catch (err) {
    console.log(`ERROR, cont/getSignupMyShop, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.signupProcess = async (req, res) => {
  try {
    console.log("POST: cont/signup");
    const data = req.body;
    // console.log("body:::", req.body.mb_nick);

    const member = new Member();
    const new_member = await member.signupData(data);
    req.session.member = new_member;
    res.redirect("/shop/pruducts/menu");
  } catch (err) {
    console.log(`ERROR, cont/signup, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.getLoginMyShop = async (req, res) => {
  try {
    console.log("GET: cont/getLoginMyShop");
    res.render("login-page");
  } catch (err) {
    console.log(`ERROR, cont/getLoginMyShop, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.loginProcess = async (req, res) => {
  try {
    console.log("POST: cont/login");
    const data = req.body;
    // console.log("body:::", req.body);
    const member = new Member();
    const result = await member.loginData(data);

    // console.log("result:::", result);
    req.session.member = result;
        req.session.save(function() {
            res.redirect("/shop/pruducts/menu");
        });
  } catch (err) {
    console.log(`ERROR, cont/login, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.logout = (req, res) => {
  console.log("GET cont.logout");
  res.send("Logout sahifadasiz");
};

shopController.checkSessions = (req, res) => {
  if (req.session?.member){
      res.json({state: 'succeed', data: req.session.member});
  } else {
    res.json({state: 'fail', message: "You are not authenticated"});  
  }
};