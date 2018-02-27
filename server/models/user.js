var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  "userId": String,
  "userName": String,
  "userPwd": String,
  "orderList": Array,
  "cartList" : [
    {
      "productId": String,
      "productName": String,
      "salePrice": String,
      "productImage": String,
      "checked": String,
      "productNum": Number
    }
  ],
  "addressList": [
      {
          "addressId": String,
          "userName": String,
          "streetName": String,
          "postCode": Number,
          "tel": Number,
          "isDefault": Boolean
      }
  ]
});  // 定义模型的字段需要和数据库对应起来

module.exports  = mongoose.model("User", userSchema);
