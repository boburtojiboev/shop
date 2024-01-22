const Member = require("../models/Member");

let shopController = module.exports;

shopController.getSignupMyShop = async (req, res) => {
  try {
      console.log("GET: cont/getSignupMyShop");
      res.render("signup");
  } catch(err) {
      console.log(`ERROR, cont/getSignupMyShop, ${err.message}`);
      res.json({state: 'fail', message: err.message});
  }
};

shopController.signupProcess = async (req, res) => {
  try {
    console.log("POST: cont/signup");
    const data = req.body;
    // console.log("body:::", req.body.mb_nick);

    const member = new Member();
    const new_member = await member.signupData(data);
    res.json({ state: "succeed", data: new_member });
  } catch (err) {
    console.log(`ERROR, cont/signup, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.getLoginMyShop = async (req, res) => {
  try {
      console.log("GET: cont/getLoginMyShop");
      res.render("login-page");
  } catch(err) {
      console.log(`ERROR, cont/getLoginMyShop, ${err.message}`);
      res.json({state: 'fail', message: err.message});
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
    res.json({ state: "succeed", data: result });
  } catch (err) {
    console.log(`ERROR, cont/login, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

shopController.logout = (req, res) => {
  console.log("GET cont.logout");
  res.send("Logout sahifadasiz");
};
