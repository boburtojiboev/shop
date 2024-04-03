const ProductModel = require("../schema/product.model");
const assert = require("assert");
const {
  product_collection_enums,
  lookup_auth_member_liked,
  shapeIntoMongooseObjectId,
} = require("../lib/config");
const Definer = require("../lib/mistake");
const Member = require("./Member");

class Product {
  constructor() {
    this.productModel = ProductModel;
  }
  async getProductsAllShopsData(member, data) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);

      // Construct the match object
      let match = {
        product_status: "PROCESS",
      };

      // If product_collection is "all", include all categories
      if (data.product_collection === "all") {
        match["product_collection"] = { $in: ["MEN", "WOMEN", "KIDS"] };
      } else {
        match["product_collection"] = data.product_collection;
      }

      // If product_size is "all", include all sizes
      if (data.product_size === "all") {
        // may need to adjust how you handle product_size depending on your schema
        // This assumes product_size is an array field
        match["product_size"] = {
          $in: [285, 280, 275, 270, 265, 260, 255, 250, 245, 240, 235, 230],
        };
      } else {
        match["product_size"] = data.product_size * 1;
      }

      // Construct the sort object
      const sort = { [data.order]: data.order === "product_price" ? 1 : -1 };

      // Perform the aggregation query
      const result = await this.productModel
        .aggregate([
          { $match: match },
          { $sort: sort },
          { $skip: (data.page * 1 - 1) * data.limit },
          { $limit: data.limit * 1 },
          //  check auth user product likes
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();

      assert.ok(result, Definer.general_err1);
      console.log("result::", result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getAllProductsData(member, data) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);

      let match = { product_status: "PROCESS" };
      if (data.shop_mb_id) {
        match["shop_mb_id"] = shapeIntoMongooseObjectId(data.shop_mb_id);
        match["product_collection"] = data.product_collection;
      }
      // If product_collection is "all", include all categories
      if (data.product_collection === "all") {
        match["product_collection"] = { $in: ["MEN", "WOMEN", "KIDS"] };
      } else {
        match["product_collection"] = data.product_collection;
      }

      const sort =
        data.order === "product_price"
          ? { [data.order]: 1 }
          : { [data.order]: -1 };

      const result = await this.productModel
        .aggregate([
          { $match: match },
          { $sort: sort },
          { $skip: (data.page * 1 - 1) * data.limit },
          { $limit: data.limit * 1 },
          //  check auth user product likes
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();
      console.log("result::", result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenProductData(member, id) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      id = shapeIntoMongooseObjectId(id);

      if (member) {
        const member_obj = new Member();
        await member_obj.viewChosenItemByMember(member, id, "product");
      }

      const result = await this.productModel
        .aggregate([
          { $match: { _id: id, product_status: "PROCESS" } },
          //  check auth user product likes
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();

      assert.ok(result, Definer.general_err1);
      return result[0];
    } catch (err) {
      throw err;
    }
  }
  async getAllProductDataShop(member) {
    try {
      member._id = shapeIntoMongooseObjectId(member._id);
      const result = await this.productModel.find({
        shop_mb_id: member._id,
      });
      assert.ok(result, Definer.general_err1);
      console.log("result", result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async addNewProductData(data, member) {
    try {
      data.shop_mb_id = shapeIntoMongooseObjectId(member._id);

      const new_product = new this.productModel(data);
      const result = await new_product.save();

      assert.ok(result, Definer.product_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateChosenProductData(id, updated_data, mb_id) {
    try {
      id = shapeIntoMongooseObjectId(id);
      console.log("shu", id);
      mb_id = shapeIntoMongooseObjectId(mb_id);
      const result = await this.productModel
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
}

module.exports = Product;
