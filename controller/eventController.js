const Event = require("../models/Event");
const assert = require("assert");
const Definer = require("../lib/mistake");
const { Script } = require("vm");

let eventController = module.exports;

eventController.getEvents = async (req, res) => {
  try {
    console.log("POST: cont/getEvents");
    const event = new Event();
    const result = await event.getEventsData(req.member, req.body);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getEvents, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

eventController.getChosenEvent = async (req, res) => {
  try {
    console.log("GET: cont/getChosenEvent");
    const event = new Event();
    const id = req.params.id;
    const result = await event.getChosenEventData(req.member, id);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getChosenEvent, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};


/******************************************
 *      BSSR related methods              *
 ******************************************/

eventController.addNewEvent = async (req, res) => {
  try {
    console.log("POST: cont/addNewEvent");
    assert.ok(req.files, Definer.general_err3);

    const event = new Event();
    let data = req.body;

    data.event_images = req.files.map((ele) => {
      return ele.path;
    });

    const result = await event.addNewEventData(data, req.member);

    const html = `<script>
                       alert("new event added succesfully");
                       window.location.replace('/shop/events/menu');
                       </script>`;
    res.end(html);
  } catch (err) {
    console.log(`ERROR, cont/addNewEvent, ${err.message}`);
  }
};

eventController.updateChosenEvent = async (req, res) => {
  try {
    console.log("POST: cont/updateChosenEvent");
    const product = new Event();
    const id = req.params.id;
    const result = await product.updateChosenEventData(
      id,
      req.body,
      req.member._id
    );
    await res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/updateChosenEvent, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};