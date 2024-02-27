class Definer {
  /** general error */
  static general_err1 = "att: something went wrong!";
  static general_err2 = "att: there is no data with that params!";
  static general_err3 = "att: file upload error!";
  /** member  auth related err */
  static auth_err1 = "att: mangodb validation is failed!";
  static auth_err2 = "jwt token creation error";
  static auth_err3 = "att: no member with that mb_nick!";
  static auth_err4 = "att: your creadentials do not match!";
  static auth_err5 = "att: you are not authenticated!";

  /** product  related err*/
  static product_err1 = "att: product creation is failed!";

  /** event  related err*/
  static event_err1 = "att: event creation is failed!";

  /** order related errors */
  static order_err1 = "att: order creation is falied";
  static order_err2 = "att: order items creation is falied";
  static order_err3 = "att: no order with that params exists";

  /** article related errors */
  static article_err1 = "att: author member for articles not provided!";
  static article_err2 = "att: no article found for that member!";
  static article_err3 = "att: no articles found for that target!";

  /** follow related errors */
  static follow_err1 = "att: self subscribtion is denied!";
  static follow_err2 = "att: new follow creation is falied!";
  static follow_err3 = "att: no follow data found!";
}

module.exports = Definer;
