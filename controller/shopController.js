const Member = require("../models/Member");
const Product = require("../models/Product");
const Definer = require("../lib/mistake");
const assert = require("assert");

let shopController = module.exports;


shopController.home = (req, res) => {
  try {
    console.log("GET/home");
    res.render('home-page');

  }catch(err){
    console.log(`ERROR, cont/home, ${err.message}`);
    res.json({ state: "fail", message: err.message });

  }
}

shopController.getMyShopProduct = async (req, res) => {
  try {
    console.log("GET: cont/getMyShopProduct");
    // todo get my shop product
    const product = new Product();
    const data = await product.getAllProductDataShop(res.locals.member);
    res.render("shop-menu", {shop_data: data});
  } catch (err) {
    console.log(`ERROR, cont/getMyShopProduct, ${err.message}`);
    res.redirect("/shop")
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
    console.log("POST: cont/signupProcess");
    const data = req.body;
    // console.log("body:::", req.body.mb_nick);
    assert(req.file, Definer.general_err3);
    const new_member = req.body;
    new_member.mb_type = "SHOP";
    new_member.mb_image = req.file.path;

    const member = new Member();
    const result = await member.signupData(new_member);
    assert(result, Definer.general_err1);

    req.session.member = new_member;
    res.redirect("/shop/products/menu");
  } catch (err) {
    console.log(`ERROR, cont/signupProcess, ${err.message}`);
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
    console.log("POST: cont/loginProcess");
    const data = req.body;
    // console.log("body:::", req.body);
    const member = new Member();
    const result = await member.loginData(data);

    // console.log("result:::", result);
    req.session.member = result;
        req.session.save(function() {
          result.mb_type === 'ADMIN' 
          ? res.redirect("/shop/all-shop") 
          : res.redirect("/shop/products/menu");
        });
  } catch (err) {
    console.log(`ERROR, cont/loginProcess, ${err.message}`);
    res.redirect("/shop/login");
  }
};

shopController.logout = (req, res) => {
  try {
    console.log("GET: cont/logout");
    req.session.destroy(function() {
      res.redirect("/shop");
    });

  } catch (err) {
    console.log(`ERROR, cont/logout, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.validateAuthShop = (req, res, next) => {
  if (req.session?.member?.mb_type === "SHOP") {
     req.member = req.session.member; 
     next();
  } else 
  res.json({
      state: "fail,", 
      message: "only authenticated members with shop type"})
}

shopController.checkSessions = (req, res) => {
  if (req.session?.member){
      res.json({state: 'succeed', data: req.session.member});
  } else {
    res.json({state: 'fail', message: "You are not authenticated"});  
  }
};

shopController.validateAdmin = (req, res, next) => {
  if (req.session?.member?.mb_type === "ADMIN") {
    req.member = req.session.member;
    next();
  } else {
    const html = `<script>
           alert('Admin page: Permission denied');
           window.location.replace('/shop');
         </script>`;
    res.end(html);
  }
};

shopController.getAllShops = (req, res) => {
  try {
    console.log("GET: cont/getAllShops");
    //todo: hamma restaranlarni chaqirib olamiz
    res.render("all-shops");
  } catch (err) {
    console.log(`ERROR, cont/getAllShops, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};