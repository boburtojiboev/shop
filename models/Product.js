const ProductModel = require("../schema/product.model");
const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistake");

class Product {
  constructor() {
    this.productModel = ProductModel;
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
    }catch(err){
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
