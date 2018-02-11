var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Goods = require('../models/goods');   // 加载私有文件

// 连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall');

// 监听数据库是否连接成功
mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success");
});

// 监听失败后的结果
mongoose.connection.on("error", function () {
  console.log("MongoDB connected failed");
});

// 监听数据库断开
mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected")
});

// 实现路由
router.get("/",function (req, res, next) {     // 当访问 "/" 的时候就默认访问到goods信息
  // res.send("hello good list......");

  // 模型的find api去查找.   在mongo中返回的doc,称之为文档
  Goods.find({}, function (err, doc) {

    if(err) {
      res.json({        // res.json 是可以直接输出json文件
        status: '1',
        msg: err.message
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,     // doc 即是查出来的文档,查找出来的文档集合
          list: doc
        }
      })
    }
  })

});

// 将路由输出
module.exports = router;
