const EventModel = require("../schema/event.model");
const assert = require("assert");
const Definer = require("../lib/mistake");
const Member = require("./Member");
const { shapeIntoMongooseObjectId } = require("../lib/config");

class Event {
  constructor() {
    this.eventModel = EventModel;
  }

  async getEventsData(member, data) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);

      const match = {
        event_status: "PROCESS",
      };
      const sort =
        data.order === "createdAt"
          ? { [data.order]: -1 }
          : { [data.order]: -1 };

      const result = await this.eventModel
        .aggregate([
          { $match: match },
          { $sort: sort },
          { $skip: (data.page * 1 - 1) * data.limit },
          { $limit: data.limit * 1 },
          // todo: check auth user product likes
        ])
        .exec();
      // assert.ok(result, Definer.general_err1);
      console.log("result::", result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async addNewEventData(data, member) {
    try {
      data.shop_mb_id = shapeIntoMongooseObjectId(member._id);

      const new_event = new this.eventModel(data);
      const result = await new_event.save();

      assert.ok(result, Definer.event_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateChosenEventData(id, updated_data, mb_id) {
    try {
      id = shapeIntoMongooseObjectId(id);
      console.log("shu", id);
      mb_id = shapeIntoMongooseObjectId(mb_id);
      const result = await this.eventModel
        .findByIdAndUpdate({ _id: id, shop_mb_id: mb_id }, updated_data, {
          runValidators: true,
          lean: true,
          returnDocument: "after",
        })
        .exec();
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getAllEventDataShop(member) {
    try {
      member._id = shapeIntoMongooseObjectId(member._id);
      const result = await this.eventModel.find({
        shop_mb_id: member._id,
      });
      assert.ok(result, Definer.general_err1);
      console.log("result", result);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Event;
