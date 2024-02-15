const assert = require("assert");
const MemberModel = require("../schema/member.model");
const Definer = require("../lib/mistake");
const { shapeIntoMongooseObjectId } = require("../lib/config");

class Shop {
  constructor() {
    this.memberModel = MemberModel;
  }
  async getShopsData(member, data) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      let match = { mb_type: "SHOP", mb_status: "ACTIVE" };
      let aggregationQuery = [];
      data.limit = data["limit"] * 1;
      data.page = data["page"] * 1;

      switch (data.order) {
        case "top":
          match["mb_top"] = "Y";
          aggregationQuery.push({ $match: match });
          aggregationQuery.push({ $sample: { size: data.limit } });
          break;
        case "random":
          aggregationQuery.push({ $match: match });
          aggregationQuery.push({ $sample: { size: data.limit } });
          break;
        default:
          aggregationQuery.push({ $match: match });
          const sort = { [data.order]: -1 };
          aggregationQuery.push({ $sort: sort });
          break;
      }

      aggregationQuery.push({ $skip: (data.page - 1) * data.limit });
      aggregationQuery.push({ $limit: data.limit });
      // todo: check auth member liked the chosen target

      const result = await this.memberModel.aggregate(aggregationQuery).exec();
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getAllShopsData() {
    try {
      const result = await this.memberModel
        .find({
          mb_type: "SHOP",
        })
        .exec();
      //   console.log(result);
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateShopByAdminData(update_data) {
    try {
      const id = shapeIntoMongooseObjectId(update_data?.id);
      const result = await this.memberModel
        .findByIdAndUpdate({ _id: id }, update_data, {
          runValidators: true,
          lean: true,
          returnDocument: "after",
        })
        .exec();
      //   console.log(result);
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Shop;
