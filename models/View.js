const ViewModel = require("../schema/view.model");
const MemberModel = require("../schema/member.model");
const ProductModel = require("../schema/product.model");
const EventModel = require("../schema/event.model");

class View {
  constructor(mb_id) {
    this.viewModel = ViewModel;
    this.memberModel = MemberModel;
    this.productModel = ProductModel;
    this.eventModel = EventModel;
    this.mb_id = mb_id;
  }

  async validateChosenTarget(view_ref_id, group_type) {
    try {
      let result;
      switch (group_type) {
        case "member":
          result = await this.memberModel
            .findById({
              _id: view_ref_id,
              mb_status: "ACTIVE",
            })
            .exec();
          break;
        case "product":
          result = await this.productModel
            .findById({
              _id: view_ref_id,
              product_status: "PROCESS",
            })
            .exec();
          break;
        case "event":
          result = await this.eventModel
            .findById({
              _id: view_ref_id,
              event_status: "PROCESS",
            })
            .exec();
          break;
      }

      return !!result;
    } catch (err) {
      throw err;
    }
  }

  async insertMemberView(view_ref_id, group_type) {
    try {
      const new_view = new this.viewModel({
        mb_id: this.mb_id,
        view_ref_id: view_ref_id,
        view_group: group_type,
      });
      const result = await new_view.save();

      // target items view sonini bittaga oshiramiz
      await this.modifyItemViewCounts(view_ref_id, group_type);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async modifyItemViewCounts(view_ref_id, group_type) {
    try {
      switch (group_type) {
        case "member":
          await this.memberModel
            .findByIdAndUpdate(
              {
                _id: view_ref_id,
              },
              { $inc: { mb_views: 1 } }
            )
            .exec();
          break;
        case "product":
          await this.productModel
            .findByIdAndUpdate(
              {
                _id: view_ref_id,
              },
              { $inc: { product_views: 1 } }
            )
            .exec();
          break;
        case "event":
          await this.eventModel
            .findByIdAndUpdate(
              {
                _id: view_ref_id,
              },
              { $inc: { event_views: 1 } }
            )
            .exec();
          break;
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  async checkViewExistance(view_ref_id) {
    try {
      const view = await this.viewModel
        .findOne({
          mb_id: this.mb_id,
          view_ref_id: view_ref_id,
        })
        .exec();
      return view ? true : false;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = View;
