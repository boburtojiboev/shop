const MemberModel = require("../schema/member.model");
const ProductModel = require("../schema/product.model");
const CommentModel = require("../schema/comment.model");
const EventModel = require("../schema/event.model");

class Comment {
  constructor(mb_id) {
    this.commentModel = CommentModel;
    this.memberModel = MemberModel;
    this.productModel = ProductModel;
    this.eventModel = EventModel;
    this.mb_id = mb_id;
  }

  async validateChosenTarger(comment_ref_id, group_type) {
    try {
      let result;
      switch (group_type) {
        case "product":
          result = await this.productModel
            .findOne({
              _id: comment_ref_id,
              product_status: "PROCESS",
            })
            .exec();
          break;
        case "event":
          result = await this.eventModel
            .findOne({
              _id: comment_ref_id,
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
  async insertMemberReview(comment_ref_id, group_type, content) {
    try {
      const new_comment = new this.commentModel({
        mb_id: this.mb_id,
        comment_ref_id: comment_ref_id,
        comment_group: group_type,
        content: content,
      });
      const result = await new_comment.save();
      await this.modifyItemCommentCounts(comment_ref_id, group_type);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async modifyItemCommentCounts(comment_ref_id, group_type) {
    try {
      switch (group_type) {
        case "product":
          await this.productModel
            .findByIdAndUpdate(
              {
                _id: comment_ref_id,
              },
              {
                $inc: { product_comment: 1 },
              }
            )
            .exec();
          break;
        case "event":
          await this.eventModel
            .findByIdAndUpdate(
              {
                _id: comment_ref_id,
              },
              { $inc: { event_comment: 1 } }
            )
            .exec();
          break;
      }
      return true;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Comment;
