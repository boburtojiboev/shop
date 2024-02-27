let follorController = module.exports;
const assert = require("assert");
const Definer = require("../lib/mistake");
const Follow = require("../models/Follow");

follorController.subscribe = async (req, res) => {
  try {
    console.log("POST: cont/subscribe");
    assert.ok(req.member, Definer.auth_err5);

    const follow = new Follow();
    await follow.subscribeData(req.member, req.body);

    res.json({ state: "success", data: "subscribed" });
  } catch (err) {
    console.log(`ERROR, cont/subscribe, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
