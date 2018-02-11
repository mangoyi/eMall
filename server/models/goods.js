var mongoose = require('mongoose')

var Schema = mongoose.Schema

var productSchema = new Schema({          // 定义model的模型
  "productId": String,
  "productName": String,
  "salePrice": Number,
  "productImage": String
})

module.exports = mongoose.model('Good', productSchema)
