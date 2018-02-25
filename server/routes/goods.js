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

// 查询商品列表数据
router.get("/list",function (req, res, next) {     // 当访问 "/" 的时候就默认访问到goods信息
    // res.send("hello good list......");
    console.log(req);

    let page = parseInt(req.param("page"));       // 分页
    let pageSize = parseInt(req.param("pageSize"));

    let skip = (page - 1)*pageSize;

    let sort = req.param("sort");  // 接收前端传过来的字段

    let priceLevel = req.param("priceLevel");

    var priceGt = '', priceLte = '';

    let params = {};

    if (priceLevel != 'all') {
        switch (priceLevel) {
            case '0': priceGt = 0;priceLte = 100;break;
            case '1':priceGt = 100;priceLte = 500;break;
            case '2':priceGt = 500;priceLte = 1000;break;
            case '3':priceGt = 1000;priceLte = 5000;break;
        }

        params = {
            salePrice: {
                $gt: priceGt,
                $lte: priceLte
            }
        }
    }

    let goodsModel = Goods.find(params).skip(skip).limit(pageSize);   // 括号内的skip表示默认跳过skip条数据. limit表示一页pageSize条数据
                                                                      // 所以skip()和limit()之间的配合，skip=1表明是第一页，那么其实一条数据都不跳过
                                                                      // 此时pageSize的条数为固定的，比如最多是8条。

    goodsModel.sort({"salePrice": sort})  // 括号里面的sort是前端传过来的，1表示升序，-1表示降序。在nodejs中传递的数据都是以对象的形式

    // 模型的find api去查找.   在mongo中返回的doc,称之为文档
    // Goods.find({}, function (err, doc) {
    goodsModel.exec(function (err, doc) {
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

// 加入购物车功能(一般向服务器提交数据使用post)
router.post("/addCart", function(req, res, next) {

    // 假设用户已经登陆
    var userId = '100000077', productId = req.body.productId;

    // 获取模型
    var User = require('../models/user');

    User.findOne({userId: userId}, function (err, userDoc) {     // 第一个是查询的条件，第二个是一个回调
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else { // 表明已经取到用户信息了
            console.log(userDoc);
            if (userDoc) {
                let goodsItem = '';
                userDoc.cartList.forEach(function (item) {
                    if (item.productId == productId) {         // 说明购物车中已经有这个数据了
                        goodsItem = item;
                        item.productNum++;            // 相同的商品直接对商品数量进行++
                    }
                });

                if (goodsItem) {   // 表示购物车已经有这个商品了
                    userDoc.save(function(err2, doc2) {
                        if (err2) {
                            res.json({
                                status: '1',
                                msg: err2.message
                            })
                        } else {
                            res.json({
                                status: '0',
                                msg: '',
                                result: 'success'            // 添加成功
                            })
                        }
                    });
                } else {
                    Goods.findOne({productId: productId}, function (err1, doc) {  // 查询其中的一件商品
                        if (err1) {
                            res.json({
                                status: "1",
                                msg: err1.message
                            })
                        } else {            // 如果这件商品存在
                            if (doc) {
                                doc.productNum = 1;         // 默认商品是一件
                                doc.checked = 1;           // 表示选中的状态

                                userDoc.cartList.push(doc);  // 将查到的商品加入到用户的购物车中

                                userDoc.save(function(err2, doc2) {
                                    if (err2) {
                                        res.json({
                                            status: '1',
                                            msg: err2.message
                                        })
                                    } else {
                                        res.json({
                                            status: '0',
                                            msg: '',
                                            result: 'success'            // 添加成功
                                        })
                                    }
                                });
                            }
                        }
                    });
                }

            }
        }
    });


});



// 将路由输出
module.exports = router;
