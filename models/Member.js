const MemberModel = require("../schema/member.model");
const CommentModel = require("../schema/comment.model");
const Definer = require("../lib/mistake");
const assert = require("assert");
const bcrypt = require("bcryptjs");
const {
  shapeIntoMongooseObjectId,
  lookup_auth_member_following,
  lookup_auth_member_liked,
} = require("../lib/config");
const View = require("./View");
const Like = require("./Like");
const Comment = require("./Comment");

class Member {
  constructor() {
    this.memberModel = MemberModel;
    this.commentModel = CommentModel;
  }
  async signupData(input) {
    try {
      const salt = await bcrypt.genSalt();
      input.mb_password = await bcrypt.hash(input.mb_password, salt);
      const new_member = new this.memberModel(input);
      let result;

      try {
        result = await new_member.save();
      } catch (mango_err) {
        // console.log(mongo_err);
        throw new Error(Definer.mongo_validation_err1);
      }

      // console.log(result);

      result.mb_password = "";
      return result;
    } catch (err) {
      throw err;
    }
  }

  async loginData(input) {
    try {
      const member = await this.memberModel
        .findOne({ mb_nick: input.mb_nick }, { mb_nick: 1, mb_password: 1 })
        .exec();

      assert.ok(member, Definer.auth_err3);

      const isMatch = await bcrypt.compare(
        input.mb_password,
        member.mb_password
      );
      assert.ok(isMatch, Definer.auth_err4);

      return await this.memberModel.findOne({ mb_nick: input.mb_nick }).exec();
    } catch (err) {
      throw err;
    }
  }

  async getChosenMemberData(member, id) {
    try {
      const auth_member = shapeIntoMongooseObjectId(member?._id);
      id = shapeIntoMongooseObjectId(id);
      console.log("member:::", member);
      //  console.log("id:::", id);

      let aggregateQuery = [
        { $match: { _id: id, mb_status: "ACTIVE" } },
        { $unset: "mb_password" },
      ];

      if (member) {
        // condition if not seem before
        await this.viewChosenItemByMember(member, id, "member");
        //  check auth member liked the chosen target
        aggregateQuery.push(lookup_auth_member_liked(auth_member));
        aggregateQuery.push(
          lookup_auth_member_following(auth_member, "members")
        );
      }

      const result = await this.memberModel.aggregate(aggregateQuery).exec();
      // console.log("result:::", result);
      assert.ok(result, Definer.general_err2);
      return result[0];
    } catch (err) {
      throw err;
    }
  }
  async viewChosenItemByMember(member, view_ref_id, group_type) {
    try {
      view_ref_id = shapeIntoMongooseObjectId(view_ref_id);
      const mb_id = shapeIntoMongooseObjectId(member._id);

      const view = new View(mb_id);
      const isValid = await view.validateChosenTarget(view_ref_id, group_type);
      console.log("isValid:::", isValid);
      assert.ok(isValid, Definer.general_err2);

      // logged user has seen target before
      const doesExist = await view.checkViewExistance(view_ref_id);
      console.log("doesExist:", doesExist);

      if (!doesExist) {
        const result = await view.insertMemberView(view_ref_id, group_type);
        assert.ok(result, Definer.general_err1);
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  async likeChosenItemByMember(member, like_ref_id, group_type) {
    try {
      like_ref_id = shapeIntoMongooseObjectId(like_ref_id);
      const mb_id = shapeIntoMongooseObjectId(member._id);

      const like = new Like(mb_id);
      const isValid = await like.validateTargetItem(like_ref_id, group_type);
      // console.log("isValid:::", isValid);
      assert.ok(isValid, Definer.general_err2);

      // doesExist
      const doesExist = await like.checkLikeExistence(like_ref_id);
      console.log("doesExist:::", doesExist);

      let data = doesExist
        ? await like.removeMemberLike(like_ref_id, group_type)
        : await like.insertMemberLike(like_ref_id, group_type);
      assert.ok(data, Definer.general_err1);

      const result = {
        like_group: data.like_group,
        like_ref_id: data.like_ref_id,
        like_status: doesExist ? 0 : 1,
      };

      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateMemberData(id, data, image) {
    try {
      const mb_id = shapeIntoMongooseObjectId(id);

      let params = {
        mb_nick: data.mb_nick,
        mb_phone: data.mb_phone,
        mb_address: data.mb_address,
        mb_description: data.mb_description,
        mb_image: image ? image.path : null,
      };
      for (let prop in params) if (!params[prop]) delete params[prop];
      const result = await this.memberModel
        .findOneAndUpdate({ _id: mb_id }, params, {
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

  // comment
  async createCommentData(member, data) {
    try {
      const comment_ref_id = shapeIntoMongooseObjectId(data.comment_ref_id);
      const mb_id = shapeIntoMongooseObjectId(member._id);
      const comment = new Comment(mb_id);
      const group_type = data.group_type;
      const content = data.content;
      const isValid = await comment.validateChosenTarger(
        comment_ref_id,
        group_type
      );
      assert.ok(isValid, Definer.general_err2);

      const result = await comment.insertMemberReview(
        comment_ref_id,
        group_type,
        content
      );
      assert.ok(result, Definer.general_err1);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getCommentsData(data) {
    try {
      const comment_ref_id = shapeIntoMongooseObjectId(data.comment_ref_id);
      const page = data.page * 1;
      const limit = data.limit * 1;
      const result = await this.commentModel
        .aggregate([
          { $match: { comment_ref_id: comment_ref_id } },
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: "members",
              localField: "mb_id",
              foreignField: "_id",
              as: "member_data",
            },
          },
          { $unwind: "$member_data" },
        ])
        .exec();
      assert.ok(result, Definer.general_err1);

      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Member;
